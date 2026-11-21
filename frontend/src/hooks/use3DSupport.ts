import { useState } from 'react'
import { useDevicePerformance, type DeviceTier } from './useDevicePerformance'
import { useReducedMotion } from './useReducedMotion'

export interface Support3D {
  /** True when a WebGL scene should be mounted. */
  enabled: boolean
  tier: DeviceTier
  reducedMotion: boolean
  reason: 'ok' | 'no-webgl' | 'reduced-motion' | 'low-tier'
}

export function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return (
      Boolean(window.WebGLRenderingContext) &&
      Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

let cachedWebGL: boolean | null = null

function webglSupport(): boolean {
  cachedWebGL ??= detectWebGL()
  return cachedWebGL
}

/**
 * Decides whether to render the 3D scenes. Cheap devices and users who
 * prefer reduced motion get the static product image instead.
 */
export function use3DSupport(): Support3D {
  const tier = useDevicePerformance()
  const reducedMotion = useReducedMotion()
  const [webgl] = useState(webglSupport)

  if (!webgl) return { enabled: false, tier, reducedMotion, reason: 'no-webgl' }
  if (reducedMotion) return { enabled: false, tier, reducedMotion, reason: 'reduced-motion' }
  if (tier === 'low') return { enabled: false, tier, reducedMotion, reason: 'low-tier' }
  return { enabled: true, tier, reducedMotion, reason: 'ok' }
}
