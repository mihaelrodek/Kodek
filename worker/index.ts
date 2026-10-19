import { handleContact, type ContactEnv } from './contact'

/**
 * Cloudflare Worker for kodek.hr.
 *
 * The site itself is the prerendered `dist/` directory, served by Workers
 * Static Assets (see wrangler.jsonc: extensionless lookup, `404.html` with a
 * real 404 status, `_headers` for CSP and caching). This handler runs first
 * on every request and only does what assets cannot:
 *
 *   - redirects `www.` and plain http to the https apex host (canonical URLs),
 *   - 301s the pre-i18n English paths (/about, /projects, /contact) to their
 *     Croatian equivalents, now that Croatian lives at the root,
 *   - serves the English 404 page for unknown URLs under /en, and
 *   - answers `POST /api/contact` via the Web3Forms proxy.
 *
 * Everything else is handed to the asset binding untouched.
 */
export interface Env extends ContactEnv {
  ASSETS: Fetcher
}

/** Canonical host; everything else under the zone redirects here. */
const CANONICAL_HOST = 'kodek.hr'

/** Old single-language URLs, kept alive for existing links and search results. */
const LEGACY_PATHS: Record<string, string> = {
  '/about': '/o-meni',
  '/projects': '/projekti',
  '/contact': '/kontakt',
}

function isEnglishPath(pathname: string): boolean {
  return pathname === '/en' || pathname.startsWith('/en/')
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    const isProductionHost =
      url.hostname === CANONICAL_HOST || url.hostname === `www.${CANONICAL_HOST}`
    if (isProductionHost && (url.hostname !== CANONICAL_HOST || url.protocol === 'http:')) {
      url.hostname = CANONICAL_HOST
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 301)
    }

    const legacy = LEGACY_PATHS[url.pathname.replace(/\/+$/, '')]
    if (legacy) {
      url.pathname = legacy
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return new Response(null, { status: 405, headers: { Allow: 'POST' } })
      }
      return handleContact(request, env)
    }

    const response = await env.ASSETS.fetch(request)
    if (response.status === 404 && isEnglishPath(url.pathname)) {
      // Assets have a single 404 page (Croatian); hydrating it under /en would
      // render English and mismatch, so serve the prerendered English one.
      const english = await env.ASSETS.fetch(new Request(new URL('/en/404', url), request))
      if (english.ok) {
        return new Response(english.body, { status: 404, headers: english.headers })
      }
    }
    return response
  },
} satisfies ExportedHandler<Env>
