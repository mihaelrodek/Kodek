/**
 * Cloudflare Pages Function — contact form proxy.
 *
 * Holds the Web3Forms access key server-side (set WEB3FORMS_ACCESS_KEY as an
 * encrypted env var in the Pages project) so it never ships in the client
 * bundle. Validates input, honors the honeypot, then forwards to Web3Forms.
 *
 * Responses are deliberately opaque: `{ success: true }` on success, otherwise
 * `{ success: false, code }` with a stable machine code the client maps to a
 * translated string. The upstream (Web3Forms) response body is never forwarded
 * — it is not localized and may leak provider detail. The English `message`
 * field is kept for curl users only; the client must not display it.
 *
 * Local dev: runs under `wrangler pages dev` (plain `vite dev` does not serve
 * /functions). See README.
 */

interface ContactBody {
  name?: string
  email?: string
  subject?: string
  message?: string
  botcheck?: string
  page?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Best-effort rate limit. State is per-isolate (resets on eviction and is not
// shared across Cloudflare locations), so this is spam friction rather than a
// guarantee — for a hard limit add a WAF rate-limiting rule or Turnstile.
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const cutoff = now - RATE_WINDOW_MS
  // Keep the map from growing unbounded across many unique IPs.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      const live = times.filter((t) => t > cutoff)
      if (live.length === 0) hits.delete(key)
      else hits.set(key, live)
    }
  }
  const recent = (hits.get(ip) ?? []).filter((t) => t > cutoff)
  if (recent.length >= RATE_MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

/** Machine-readable failure codes. Kept in sync with ContactPage.tsx. */
type ErrorCode = 'not_configured' | 'rate_limited' | 'invalid_body' | 'validation' | 'upstream'

const ERROR_STATUS: Record<ErrorCode, number> = {
  not_configured: 500,
  rate_limited: 429,
  invalid_body: 400,
  validation: 422,
  upstream: 502,
}

// English only, and only so a curl user sees something readable. The client
// renders its own translated copy from `code`.
const ERROR_MESSAGE: Record<ErrorCode, string> = {
  not_configured: 'Contact form is not configured.',
  rate_limited: 'Too many requests — please try again later.',
  invalid_body: 'Invalid request body.',
  validation: 'Validation failed.',
  upstream: 'Could not deliver the message right now.',
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function ok(): Response {
  return json({ success: true }, 200)
}

function fail(code: ErrorCode): Response {
  return json({ success: false, code, message: ERROR_MESSAGE[code] }, ERROR_STATUS[code])
}

export const onRequestPost = async (context: {
  request: Request
  env: { WEB3FORMS_ACCESS_KEY?: string }
}): Promise<Response> => {
  const { request, env } = context

  if (!env.WEB3FORMS_ACCESS_KEY) return fail('not_configured')

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
  if (rateLimited(ip)) return fail('rate_limited')

  let body: ContactBody
  try {
    body = (await request.json()) as ContactBody
  } catch {
    return fail('invalid_body')
  }

  // Honeypot — silently accept bots without forwarding.
  if (body.botcheck) return ok()

  const name = (body.name ?? '').trim()
  const email = (body.email ?? '').trim()
  const message = (body.message ?? '').trim()
  const subject = (body.subject ?? '').trim()

  // Length caps keep a scripted caller from relaying huge payloads upstream.
  if (
    !name ||
    name.length > 100 ||
    email.length > 254 ||
    !EMAIL_RE.test(email) ||
    message.length < 10 ||
    message.length > 5000 ||
    subject.length > 200
  ) {
    return fail('validation')
  }

  let res: Response
  try {
    res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: env.WEB3FORMS_ACCESS_KEY,
        from_name: 'Portfolio contact form',
        subject: subject || 'New message from your portfolio',
        name,
        email,
        message,
        page: (body.page ?? '').slice(0, 300),
      }),
    })
  } catch {
    // Network failure reaching Web3Forms — indistinguishable to the caller
    // from an upstream error, and reported the same way.
    return fail('upstream')
  }

  // The upstream body is intentionally dropped: whatever went wrong there,
  // the client only ever needs "it did not go through".
  if (!res.ok) return fail('upstream')
  return ok()
}
