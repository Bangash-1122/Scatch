import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function initialPreference(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia(QUERY).matches
}

/**
 * Tracks the user's reduced-motion preference. The value is read during
 * initialization to avoid a cascading render on mount.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(initialPreference)

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY)
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches)

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return reduced
}

export const usePrefersReducedMotion = useReducedMotion
