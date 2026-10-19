/**
 * Google Analytics 4, loaded only after the visitor accepts it.
 *
 * The Measurement ID comes from `VITE_GA_MEASUREMENT_ID` (see `.env.production`).
 * Without it nothing loads and no consent banner is shown. The choice is kept
 * in localStorage under `CONSENT_KEY`; it is read only after mount, so the
 * prerendered markup never depends on it (hydration-safe).
 */
export const GA_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID || undefined

export const CONSENT_KEY = 'kodek-analytics-consent'
/** Fired on window to reopen the consent banner (footer "cookie settings"). */
export const CONSENT_OPEN_EVENT = 'kodek:open-consent'

export type Consent = 'granted' | 'denied'

type Gtag = (...args: unknown[]) => void
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

export function readConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export function storeConsent(value: Consent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    // Private mode or blocked storage: the choice just lasts for this page view.
  }
}

let loaded = false

/** Injects gtag.js once. Page views are sent manually by `trackPageview`. */
export function loadAnalytics() {
  if (!GA_ID || loaded) return
  loaded = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js expects the `arguments` object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(script)
}

export function isAnalyticsLoaded() {
  return loaded
}

export function trackPageview(path: string) {
  if (!loaded || !window.gtag) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

/**
 * Withdrawing consent: stop sending and drop GA cookies on this domain. A
 * reload is the reliable way to unload gtag.js entirely.
 */
export function revokeAnalytics() {
  if (GA_ID) {
    ;(window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true
  }
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim()
    if (name === '_ga' || name.startsWith('_ga_')) {
      const domain = window.location.hostname.replace(/^www\./, '')
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`
      document.cookie = `${name}=; Max-Age=0; path=/`
    }
  }
}
