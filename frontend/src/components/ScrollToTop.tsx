import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset scroll position on navigation (HashRouter keeps it otherwise). */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}
