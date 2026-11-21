import { describe, expect, it } from 'vitest'
import { formatPrice, finalPrice } from './format'
import { darken, isValidHex, lighten, mixHex, readableTextColor } from './color'

describe('formatPrice', () => {
  it('formats with the rupee symbol and Indian grouping', () => {
    expect(formatPrice(1200)).toBe('₹ 1,200')
    expect(formatPrice(123456)).toBe('₹ 1,23,456')
  })

  it('never renders negative prices', () => {
    expect(formatPrice(-50)).toBe('₹ 0')
  })
})

describe('finalPrice', () => {
  it('applies the product discount', () => {
    expect(finalPrice(1000, 25)).toBe(750)
  })

  it('returns the list price when there is no discount', () => {
    expect(finalPrice(800)).toBe(800)
  })
})

describe('color helpers', () => {
  it('validates hex colors', () => {
    expect(isValidHex('#ff00aa')).toBe(true)
    expect(isValidHex('#abc')).toBe(true)
    expect(isValidHex('red')).toBe(false)
    expect(isValidHex(undefined)).toBe(false)
  })

  it('mixes toward a target', () => {
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080')
  })

  it('darkens and lightens safely', () => {
    expect(isValidHex(darken('#568fd2', 0.3))).toBe(true)
    expect(isValidHex(lighten('#568fd2'))).toBe(true)
    expect(darken(undefined)).toBe('#1f2937')
  })

  it('picks readable text for a background', () => {
    expect(readableTextColor('#ffffff')).toBe('#111827')
    expect(readableTextColor('#111827')).toBe('#FFFFFF')
  })
})
