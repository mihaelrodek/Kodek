import { useEffect, useLayoutEffect, useState } from 'react'

// useLayoutEffect applies the real value before the browser paints on the client;
// on the server (prerender) there's no layout phase, so fall back to useEffect to
// avoid React's "useLayoutEffect does nothing on the server" warning.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Subscribe to a CSS media query. Returns true when the query matches.
 *
 * Starts `false` so the prerendered HTML and the client's first render agree
 * (no hydration mismatch). The real value is read in a layout effect — before
 * paint — so there is no visible flash on the client.
 */
export function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
