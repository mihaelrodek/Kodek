// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import worker, { type Env } from '../../worker/index'

/** Minimal asset binding: records what the Worker forwarded and answers 200. */
function env(overrides: Partial<Env> = {}): Env {
  return {
    ASSETS: { fetch: vi.fn(() => Promise.resolve(new Response('asset', { status: 200 }))) },
    ...overrides,
  } as unknown as Env
}

describe('worker fetch', () => {
  it('redirects www to the apex host, keeping path and query', async () => {
    const res = await worker.fetch(new Request('https://www.kodek.hr/o-meni?x=1'), env())

    expect(res.status).toBe(301)
    expect(res.headers.get('Location')).toBe('https://kodek.hr/o-meni?x=1')
  })

  it('redirects plain http on the production host to https', async () => {
    const res = await worker.fetch(new Request('http://kodek.hr/kontakt'), env())

    expect(res.status).toBe(301)
    expect(res.headers.get('Location')).toBe('https://kodek.hr/kontakt')
  })

  it('leaves http alone on other hosts (wrangler dev)', async () => {
    const e = env()
    const res = await worker.fetch(new Request('http://localhost:8787/'), e)

    expect(res.status).toBe(200)
    expect(e.ASSETS.fetch).toHaveBeenCalled()
  })

  it.each([
    ['/about', '/o-meni'],
    ['/projects/', '/projekti'],
    ['/contact', '/kontakt'],
  ])('301s the legacy path %s to %s, keeping the query', async (from, to) => {
    const res = await worker.fetch(new Request(`https://kodek.hr${from}?c=web`), env())

    expect(res.status).toBe(301)
    expect(res.headers.get('Location')).toBe(`https://kodek.hr${to}?c=web`)
  })

  it('serves the English 404 page for unknown URLs under /en', async () => {
    const fetchAsset = vi.fn((request: Request) => {
      const { pathname } = new URL(request.url)
      return Promise.resolve(
        pathname === '/en/404'
          ? new Response('english 404', { status: 200 })
          : new Response('croatian 404', { status: 404 }),
      )
    })
    const e = env({ ASSETS: { fetch: fetchAsset } as unknown as Fetcher })

    const res = await worker.fetch(new Request('https://kodek.hr/en/nope'), e)

    expect(res.status).toBe(404)
    await expect(res.text()).resolves.toBe('english 404')
  })

  it('keeps the Croatian 404 page for unknown root URLs', async () => {
    const e = env({
      ASSETS: {
        fetch: vi.fn(() => Promise.resolve(new Response('croatian 404', { status: 404 }))),
      } as unknown as Fetcher,
    })

    const res = await worker.fetch(new Request('https://kodek.hr/nope'), e)

    expect(res.status).toBe(404)
    await expect(res.text()).resolves.toBe('croatian 404')
    expect(e.ASSETS.fetch).toHaveBeenCalledTimes(1)
  })

  it('hands every other request to the asset binding', async () => {
    const e = env()
    const request = new Request('https://kodek.hr/o-meni')

    const res = await worker.fetch(request, e)

    expect(res.status).toBe(200)
    expect(e.ASSETS.fetch).toHaveBeenCalledWith(request)
  })

  it('rejects non-POST on /api/contact without touching assets', async () => {
    const e = env()

    const res = await worker.fetch(new Request('https://kodek.hr/api/contact'), e)

    expect(res.status).toBe(405)
    expect(res.headers.get('Allow')).toBe('POST')
    expect(e.ASSETS.fetch).not.toHaveBeenCalled()
  })

  it('routes POST /api/contact to the contact handler', async () => {
    const e = env()
    const request = new Request('https://kodek.hr/api/contact', {
      method: 'POST',
      body: '{}',
      headers: { 'Content-Type': 'application/json' },
    })

    // No access key configured: the handler's own 500 proves it was reached.
    const res = await worker.fetch(request, e)

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({ code: 'not_configured' })
    expect(e.ASSETS.fetch).not.toHaveBeenCalled()
  })
})
