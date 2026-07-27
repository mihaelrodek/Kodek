import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll to the top on route change. The app uses <BrowserRouter>
 * (a non-data router), which does not restore scroll — so without this you
 * land mid-page when navigating away from a long scrolled route (e.g. the
 * timeline). Skips when the URL carries a hash so in-page anchors still work.
 *
 * Uses `behavior: 'instant'` to override the global `scroll-behavior: smooth`
 * (index.css) — otherwise every navigation animates a long scroll back up.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
