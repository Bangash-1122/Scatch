import { lazy } from 'react'

/**
 * Three.js is ~280 kB gzipped. These wrappers keep it out of the initial
 * bundle: it downloads only when a 3D surface is actually mounted.
 */
export const LazyProductViewer = lazy(() => import('./ProductViewer'))
export const LazyHeroScene = lazy(() => import('./HeroScene'))
export const LazyProductViewerModal = lazy(() => import('./ProductViewerModal'))

let modalPrefetched = false

/**
 * Warm the 3D dialog chunk on hover/focus so the first click feels instant.
 * Safe to call repeatedly.
 */
export function prefetchProductViewerModal(): void {
  if (modalPrefetched) return
  modalPrefetched = true
  void import('./ProductViewerModal')
}
