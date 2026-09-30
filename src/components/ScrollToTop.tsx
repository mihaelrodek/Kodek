import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll to the top on route change. The app uses <BrowserRouter>
 * (a non-data router), which does not restore scroll — so without this you
 * land mid-page when navigating away from a long scrolled route (e.g. the
 * timeline). Hash targets are resolved after lazy route content mounts.
 *
 * Uses `behavior: 'instant'` to override the global `scroll-behavior: smooth`
 * (index.css) — otherwise every navigation animates a long scroll back up.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    let targetId: string
    try {
      targetId = decodeURIComponent(hash.slice(1))
    } catch {
      return
    }

    const scrollToHash = () => {
      const target = document.getElementById(targetId)
      if (!target) return false
      target.scrollIntoView({ block: 'start' })
      return true
    }

    let observer: MutationObserver | undefined
    const frame = window.requestAnimationFrame(() => {
      if (scrollToHash()) return

      // A route chunk may still be inside Suspense when this effect runs.
      // Watch the main landmark until the requested section is mounted.
      observer = new MutationObserver(() => {
        if (scrollToHash()) observer?.disconnect()
      })
      observer.observe(document.getElementById('main') ?? document.body, {
        childList: true,
        subtree: true,
      })
    })

    const timeout = window.setTimeout(() => observer?.disconnect(), 3000)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
      observer?.disconnect()
    }
  }, [pathname, hash])

  return null
}
