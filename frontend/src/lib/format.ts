const CURRENCY = '₹'

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
})

/** Format a price for display, e.g. 1200 -> "₹ 1,200". */
export function formatPrice(value: number): string {
  return `${CURRENCY} ${numberFormatter.format(Math.max(0, Math.round(value)))}`
}

/** Percentage of the original price that is discounted (0 if none). */
export function discountPercentOf(price: number, discountPercent?: number): number {
  if (!discountPercent) return 0
  return Math.min(100, Math.max(0, discountPercent))
}

/** Effective price after the product discount, rounded to the nearest rupee. */
export function finalPrice(price: number, discountPercent?: number): number {
  const pct = discountPercentOf(price, discountPercent)
  return Math.round(price - (price * pct) / 100)
}
