import { useEffect, useState } from 'react'

export type DeviceTier = 'high' | 'medium' | 'low'

function detectTier(): DeviceTier {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
  if (!gl) return 'low'

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  const renderer = debugInfo
    ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? '')
    : ''
  const cores = navigator.hardwareConcurrency ?? 4
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4

  if (cores <= 2 || memory <= 2 || /intel|integrated|basic/i.test(renderer)) return 'low'
  if (cores <= 4 || memory <= 4) return 'medium'
  return 'high'
}

/**
 * Classifies the device so heavy 3D scenes can downgrade resolution and
 * effects. Starts at `medium` and refines after the first paint.
 */
export function useDevicePerformance(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('medium')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setTier(detectTier())
      } catch {
        setTier('low')
      }
    }, 100)

    return () => window.clearTimeout(timer)
  }, [])

  return tier
}
