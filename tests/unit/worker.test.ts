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
    const res = await worker.fetch(new Request('https://www.kodek.hr/about?x=1'), env())

    expect(res.status).toBe(301)
    expect(res.headers.get('Location')).toBe('https://kodek.hr/about?x=1')
  })

  it('hands every other request to the asset binding', async () => {
    const e = env()
    const request = new Request('https://kodek.hr/about')

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
