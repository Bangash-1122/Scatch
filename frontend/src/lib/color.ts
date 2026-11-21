const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

export function isValidHex(value: string | undefined | null): value is string {
  return typeof value === 'string' && HEX.test(value.trim())
}

function parseHex(hex: string): [number, number, number] {
  let value = hex.replace('#', '')
  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('')
  }
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ]
}

const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)))

function toHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => clamp(c).toString(16).padStart(2, '0')).join('')}`
}

/** Blend `hex` toward `target` by `amount` (0..1). Safe on invalid input. */
export function mixHex(hex: string | undefined, target: string, amount: number): string {
  if (!isValidHex(hex) || !isValidHex(target)) return isValidHex(target) ? target : '#D1B1A3'
  const a = parseHex(hex)
  const b = parseHex(target)
  const t = Math.min(1, Math.max(0, amount))
  return toHex([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t])
}

export function darken(hex: string | undefined, amount = 0.25): string {
  return mixHex(hex, '#1f2937', amount)
}

export function lighten(hex: string | undefined, amount = 0.25): string {
  return mixHex(hex, '#ffffff', amount)
}

/** WCAG relative luminance (0..1) for picking readable text over a color. */
export function luminance(hex: string | undefined): number {
  if (!isValidHex(hex)) return 0
  const [r, g, b] = parseHex(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function readableTextColor(background: string | undefined): '#111827' | '#FFFFFF' {
  return luminance(background) > 0.45 ? '#111827' : '#FFFFFF'
}
