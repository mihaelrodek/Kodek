import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  CONSENT_OPEN_EVENT,
  GA_ID,
  isAnalyticsLoaded,
  loadAnalytics,
  readConsent,
  revokeAnalytics,
  storeConsent,
  trackPageview,
  type Consent,
} from '../lib/analytics'
import { useTranslation } from '../hooks/useTranslation'

/**
 * Consent banner + page-view tracking. Renders nothing on the server and on
 * the first client render; everything happens after mount.
 */
export default function Analytics() {
  const { t } = useTranslation()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [consent, setConsent] = useState<Consent | null>(null)

  useEffect(() => {
    if (!GA_ID) return
    const stored = readConsent()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored)
    if (stored === 'granted') loadAnalytics()
    else if (stored === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [])

  // One page_view per route change (the SPA never reloads the document).
  useEffect(() => {
    if (consent === 'granted' && isAnalyticsLoaded()) {
      trackPageview(location.pathname + location.search)
    }
  }, [consent, location.pathname, location.search])

  if (!GA_ID || !open) return null

  const choose = (value: Consent) => {
    storeConsent(value)
    setConsent(value)
    setOpen(false)
    if (value === 'granted') loadAnalytics()
    else revokeAnalytics()
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t.consent.title}
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-2xl shadow-black/10 backdrop-blur sm:inset-x-auto sm:right-5 sm:bottom-5 dark:border-zinc-800 dark:bg-zinc-900/95"
    >
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.consent.title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t.consent.body}
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => choose('granted')}
          className="focus-ring bg-accent-700 hover:bg-accent-800 inline-flex min-h-10 items-center rounded-full px-5 text-sm font-medium text-white transition"
        >
          {t.consent.accept}
        </button>
        <button
          type="button"
          onClick={() => choose('denied')}
          className="focus-ring inline-flex min-h-10 items-center rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {t.consent.decline}
        </button>
      </div>
    </div>
  )
}
