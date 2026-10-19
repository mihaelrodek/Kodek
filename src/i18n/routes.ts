import type { Lang } from './translations'

/**
 * Language lives in the URL: Croatian (the default) at the root, English under
 * `/en`. Prerender, hydration and crawlers all see the same language for a URL,
 * so nothing language-dependent has to wait for a post-mount effect.
 * Keep in sync with the ROUTES table in scripts/prerender.mjs.
 */
export type RouteKey = 'home' | 'about' | 'projects' | 'contact'

export const DEFAULT_LANG: Lang = 'hr'

export const ROUTE_PATHS: Record<Lang, Record<RouteKey, string>> = {
  hr: { home: '/', about: '/o-meni', projects: '/projekti', contact: '/kontakt' },
  en: { home: '/en', about: '/en/about', projects: '/en/projects', contact: '/en/contact' },
}

export function langFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : DEFAULT_LANG
}

export function pathFor(lang: Lang, key: RouteKey): string {
  return ROUTE_PATHS[lang][key]
}

function stripTrailingSlash(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

/** Which page a pathname is, in either language; undefined for unknown paths. */
export function routeKeyFromPath(pathname: string): RouteKey | undefined {
  const clean = stripTrailingSlash(pathname)
  for (const paths of Object.values(ROUTE_PATHS)) {
    const key = (Object.keys(paths) as RouteKey[]).find((k) => paths[k] === clean)
    if (key) return key
  }
  return undefined
}

/** The same page in another language (unknown pages fall back to that language's home). */
export function translatePath(pathname: string, target: Lang): string {
  return pathFor(target, routeKeyFromPath(pathname) ?? 'home')
}
