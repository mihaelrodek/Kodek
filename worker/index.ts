import { handleContact, type ContactEnv } from './contact'

/**
 * Cloudflare Worker for kodek.hr.
 *
 * The site itself is the prerendered `dist/` directory, served by Workers
 * Static Assets (see wrangler.jsonc: extensionless lookup, `404.html` with a
 * real 404 status, `_headers` for CSP and caching). This handler runs first
 * on every request and only does what assets cannot:
 *
 *   - redirects `www.` to the apex host, matching the canonical URLs, and
 *   - answers `POST /api/contact` via the Web3Forms proxy.
 *
 * Everything else is handed to the asset binding untouched.
 */
export interface Env extends ContactEnv {
  ASSETS: Fetcher
}

/** Canonical host; everything else under the zone redirects here. */
const CANONICAL_HOST = 'kodek.hr'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return new Response(null, { status: 405, headers: { Allow: 'POST' } })
      }
      return handleContact(request, env)
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
