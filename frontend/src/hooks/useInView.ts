import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

/**
 * Only mount heavy content (a 3D canvas) once it has scrolled into view.
 */
export function useInView<T extends Element = HTMLDivElement>(
  options?: IntersectionObserverInit,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')
  const optionsRef = useRef(options)

  useEffect(() => {
    const element = ref.current
    if (!element || inView) return

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setInView(true)
        observer.disconnect()
      }
    }, optionsRef.current)

    observer.observe(element)
    return () => observer.disconnect()
  }, [inView])

  return [ref, inView]
}
