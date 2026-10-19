/**
 * Contact form proxy — the only server-side code, run by the Worker in
 * worker/index.ts for `POST /api/contact`.
 *
 * Holds the Resend API key server-side (RESEND_API_KEY is a Worker secret) so
 * it never ships in the client bundle. Validates input, honors the honeypot,
 * then sends two emails through Resend (kodek.hr must be a verified domain):
 *
 *   1. the enquiry to OWNER_EMAIL, with Reply-To set to the visitor, and
 *   2. a short confirmation to the visitor, in the language of the page they
 *      wrote from. It deliberately echoes nothing the visitor typed (not even
 *      the name), so the form cannot be abused to mail arbitrary content to a
 *      third-party address. A failed confirmation does not fail the request:
 *      the enquiry itself already arrived.
 *
 * Responses are deliberately opaque: `{ success: true }` on success, otherwise
 * `{ success: false, code }` with a stable machine code the client maps to a
 * translated string. The upstream (Resend) response body is never forwarded
 * — it is not localized and may leak provider detail. The English `message`
 * field is kept for curl users only; the client must not display it.
 *
 * Local dev: `npm run dev:worker` (plain `vite dev` has no /api). See README.
 */

export interface ContactEnv {
  RESEND_API_KEY?: string
}

const RESEND_URL = 'https://api.resend.com/emails'
/** Where enquiries go. */
const OWNER_EMAIL = 'info@kodek.hr'
/** Sender of the enquiry notification (any address on the verified domain). */
const NOTIFY_FROM = 'Kodek web obrazac <obrazac@kodek.hr>'
/** Sender of the visitor confirmation; replies land in the owner's inbox. */
const CONFIRM_FROM = 'Kodek <info@kodek.hr>'

type Lang = 'hr' | 'en'

const CONFIRMATION: Record<Lang, { subject: string; text: string }> = {
  hr: {
    subject: 'Zaprimili smo vaš upit — Kodek',
    text: [
      'Pozdrav,',
      '',
      'hvala na upitu poslanom preko kodek.hr. Poruka je zaprimljena i javit ću vam se u roku od jednog radnog dana.',
      '',
      'Ako želite nešto dodati, slobodno odgovorite na ovaj e-mail.',
      '',
      'Lijep pozdrav,',
      'Mihael Rodek',
      'Kodek, obrt za računalno programiranje i ostale usluge',
      'https://kodek.hr',
    ].join('\n'),
  },
  en: {
    subject: 'We received your enquiry — Kodek',
    text: [
      'Hello,',
      '',
      'thank you for getting in touch through kodek.hr. Your message has arrived and I will get back to you within one business day.',
      '',
      'If you would like to add anything, simply reply to this email.',
      '',
      'Best regards,',
      'Mihael Rodek',
      'Kodek, obrt za računalno programiranje i ostale usluge',
      'https://kodek.hr/en',
    ].join('\n'),
  },
}

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

/** Language of the page the form was sent from: English under /en, Croatian otherwise. */
function langOf(page: string): Lang {
  try {
    const { pathname } = new URL(page)
    return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'hr'
  } catch {
    return 'hr'
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/** Strip CR/LF so visitor input can never add lines to a header-like field. */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ')
}

async function sendEmail(apiKey: string, email: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(email),
    })
    return res.ok
  } catch {
    // Network failure reaching Resend: reported the same way as an upstream error.
    return false
  }
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

export async function handleContact(request: Request, env: ContactEnv): Promise<Response> {
  if (!env.RESEND_API_KEY) return fail('not_configured')

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

  const page = (body.page ?? '').slice(0, 300)
  const lang = langOf(page)
  const rows: [string, string][] = [
    ['Ime', name],
    ['Email', email],
    ['Tema', subject || '—'],
    ['Stranica', page || '—'],
  ]

  // The upstream body is intentionally dropped: whatever went wrong there,
  // the client only ever needs "it did not go through".
  const delivered = await sendEmail(env.RESEND_API_KEY, {
    from: NOTIFY_FROM,
    to: [OWNER_EMAIL],
    reply_to: email,
    subject: oneLine(`Novi upit: ${subject || name}`).slice(0, 200),
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`,
    html: `<table>${rows
      .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v)}</td></tr>`)
      .join('')}</table><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  })
  if (!delivered) return fail('upstream')

  // Best effort: the enquiry is already in the owner's inbox.
  await sendEmail(env.RESEND_API_KEY, {
    from: CONFIRM_FROM,
    to: [email],
    reply_to: OWNER_EMAIL,
    subject: CONFIRMATION[lang].subject,
    text: CONFIRMATION[lang].text,
  })
  return ok()
}
