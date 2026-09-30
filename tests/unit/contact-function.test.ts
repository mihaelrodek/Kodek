// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { onRequestPost } from '../../functions/api/contact'

interface Env {
  WEB3FORMS_ACCESS_KEY?: string
}

const KEY = 'test-access-key'

// The module keeps a per-isolate rate-limit map (5 hits / 10 min / IP) that
// lives for the whole file, so every case uses its own client IP.
let ipCounter = 0
function nextIp(): string {
  ipCounter += 1
  return `203.0.113.${ipCounter}`
}

function post(body: unknown, options: { raw?: string; ip?: string } = {}): Request {
  return new Request('https://example.com/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CF-Connecting-IP': options.ip ?? nextIp(),
    },
    body: options.raw ?? JSON.stringify(body),
  })
}

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'Hello',
  message: 'This message is comfortably over ten characters long.',
  page: 'https://example.com/contact',
}

// Takes a factory: a Response body can only be read once, and the rate-limit
// case calls the handler six times.
function mockFetch(make: () => Response) {
  const fn = vi.fn(() => Promise.resolve(make()))
  vi.stubGlobal('fetch', fn)
  return fn
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('onRequestPost', () => {
  it('returns 500 when WEB3FORMS_ACCESS_KEY is missing', async () => {
    const fetchMock = mockFetch(() => new Response('{}', { status: 200 }))

    const res = await onRequestPost({ request: post(valid), env: {} as Env })

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({ success: false, code: 'not_configured' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('accepts a honeypot submission without forwarding it', async () => {
    const fetchMock = mockFetch(() => new Response('{}', { status: 200 }))

    const res = await onRequestPost({
      request: post({ ...valid, botcheck: 'i am a bot' }),
      env: { WEB3FORMS_ACCESS_KEY: KEY },
    })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ success: true })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns 400 when the body is not JSON', async () => {
    const fetchMock = mockFetch(() => new Response('{}', { status: 200 }))

    const res = await onRequestPost({
      request: post(null, { raw: 'not json at all' }),
      env: { WEB3FORMS_ACCESS_KEY: KEY },
    })

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ success: false, code: 'invalid_body' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([
    ['a missing name', { ...valid, name: '   ' }],
    ['an over-long name', { ...valid, name: 'a'.repeat(101) }],
    ['a malformed email', { ...valid, email: 'ada@@example' }],
    ['an over-long email', { ...valid, email: `${'a'.repeat(250)}@example.com` }],
    ['a too-short message', { ...valid, message: 'too short' }],
    ['an over-long message', { ...valid, message: 'a'.repeat(5001) }],
    ['an over-long subject', { ...valid, subject: 'a'.repeat(201) }],
  ])('returns 422 for %s', async (_label, body) => {
    const fetchMock = mockFetch(() => new Response('{}', { status: 200 }))

    const res = await onRequestPost({
      request: post(body),
      env: { WEB3FORMS_ACCESS_KEY: KEY },
    })

    expect(res.status).toBe(422)
    await expect(res.json()).resolves.toMatchObject({ success: false, code: 'validation' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('forwards a valid submission to Web3Forms and returns 200', async () => {
    const fetchMock = mockFetch(
      () => new Response(JSON.stringify({ success: true, message: 'Email sent' }), { status: 200 }),
    )

    const res = await onRequestPost({
      request: post(valid),
      env: { WEB3FORMS_ACCESS_KEY: KEY },
    })

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/json')
    // Exactly `{ success: true }` — the upstream body (here carrying a
    // "message" field) must not be forwarded to the client.
    await expect(res.json()).resolves.toEqual({ success: true })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.web3forms.com/submit')
    expect(init.method).toBe('POST')
    expect(JSON.parse(String(init.body))).toMatchObject({
      access_key: KEY,
      name: valid.name,
      email: valid.email,
      subject: valid.subject,
      message: valid.message,
      page: valid.page,
    })
  })

  it('never leaks the access key to the client', async () => {
    const fetchMock = mockFetch(
      () => new Response(JSON.stringify({ success: true }), { status: 200 }),
    )

    const res = await onRequestPost({
      request: post(valid),
      env: { WEB3FORMS_ACCESS_KEY: KEY },
    })

    expect(await res.text()).not.toContain(KEY)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it.each([500, 502, 403])(
    'reports an upstream %i as a 502 with code "upstream"',
    async (upstreamStatus) => {
      mockFetch(
        () =>
          new Response(JSON.stringify({ success: false, message: 'upstream detail' }), {
            status: upstreamStatus,
          }),
      )

      const res = await onRequestPost({
        request: post(valid),
        env: { WEB3FORMS_ACCESS_KEY: KEY },
      })

      // The upstream status and body are collapsed into one opaque failure.
      expect(res.status).toBe(502)
      const body = (await res.json()) as Record<string, unknown>
      expect(body).toMatchObject({ success: false, code: 'upstream' })
      expect(body.message).not.toBe('upstream detail')
    },
  )

  it('reports a fetch rejection as a 502 with code "upstream"', async () => {
    const fetchMock = vi.fn(() => Promise.reject(new Error('getaddrinfo ENOTFOUND')))
    vi.stubGlobal('fetch', fetchMock)

    const res = await onRequestPost({
      request: post(valid),
      env: { WEB3FORMS_ACCESS_KEY: KEY },
    })

    expect(res.status).toBe(502)
    await expect(res.json()).resolves.toMatchObject({ success: false, code: 'upstream' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('rate-limits a single IP after 5 accepted submissions', async () => {
    const ip = '198.51.100.7'
    mockFetch(() => new Response(JSON.stringify({ success: true }), { status: 200 }))

    for (let i = 0; i < 5; i += 1) {
      const ok = await onRequestPost({
        request: post(valid, { ip }),
        env: { WEB3FORMS_ACCESS_KEY: KEY },
      })
      expect(ok.status).toBe(200)
    }

    const limited = await onRequestPost({
      request: post(valid, { ip }),
      env: { WEB3FORMS_ACCESS_KEY: KEY },
    })
    expect(limited.status).toBe(429)
    await expect(limited.json()).resolves.toMatchObject({
      success: false,
      code: 'rate_limited',
    })
  })
})
