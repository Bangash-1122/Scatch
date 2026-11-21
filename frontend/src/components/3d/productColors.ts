import type { Product } from '@/types/products'
import { darken, isValidHex, lighten } from '@/lib/color'
import type { BagModelColors } from './BagMesh'

const FALLBACK: BagModelColors = { body: '#d1b1a3', panel: '#a9856f', accent: '#e9d3cb' }

/** Derive 3D materials from a product's stored palette. */
export function bagColorsFromProduct(product: Pick<Product, 'bgColor' | 'panelColor'>): BagModelColors {
  const body = isValidHex(product.panelColor) ? product.panelColor : FALLBACK.body
  return {
    body,
    panel: darken(body, 0.22),
    accent: isValidHex(product.bgColor) ? lighten(product.bgColor, 0.06) : FALLBACK.accent,
  }
}
