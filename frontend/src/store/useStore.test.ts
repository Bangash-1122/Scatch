import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from './useStore'
import { products as initialProducts } from '@/data/products'

const product = initialProducts[0]!
const discounted = initialProducts.find((item) => item.discountPercent) ?? product

function resetStore() {
  useStore.setState({
    user: { id: 'test', fullName: 'Test User', email: 'test@example.com', role: 'user' },
    products: initialProducts,
    cartItems: [],
    orders: [],
    productsStatus: 'ready',
  })
}

describe('useStore cart', () => {
  beforeEach(() => {
    resetStore()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
  })

  it('adds a product and increments quantity on repeat adds', () => {
    useStore.getState().addToCart(product)
    useStore.getState().addToCart(product)

    const cart = useStore.getState().cartItems
    expect(cart).toHaveLength(1)
    expect(cart[0]?.quantity).toBe(2)
  })

  it('clamps quantity to available stock', () => {
    useStore.getState().addToCart(product, product.stock + 5)
    expect(useStore.getState().cartItems[0]?.quantity).toBe(product.stock)
  })

  it('removes an item when quantity drops to zero', () => {
    useStore.getState().addToCart(product)
    useStore.getState().updateQuantity(product.id, 0)
    expect(useStore.getState().cartItems).toHaveLength(0)
  })

  it('ignores out-of-stock products', () => {
    useStore.getState().addToCart({ ...product, stock: 0 })
    expect(useStore.getState().cartItems).toHaveLength(0)
  })
})

describe('useStore placeOrder', () => {
  beforeEach(() => {
    resetStore()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
  })

  it('applies the discount and platform fee, then clears the cart', async () => {
    useStore.getState().addToCart(discounted, 2)
    const stockBefore = useStore.getState().products.find((p) => p.id === discounted.id)?.stock ?? 0

    const result = await useStore.getState().placeOrder('Test Street 1', 'COD')

    const expected = Math.round(discounted.price * 2 - (discounted.price * (discounted.discountPercent ?? 0) / 100) * 2 + 20)
    const order = useStore.getState().orders[0]
    const stockAfter = useStore.getState().products.find((p) => p.id === discounted.id)?.stock ?? 0

    expect(result.success).toBe(true)
    expect(order?.totalAmount).toBe(expected)
    expect(order?.status).toBe('PENDING')
    expect(useStore.getState().cartItems).toHaveLength(0)
    expect(stockAfter).toBe(stockBefore - 2)
  })

  it('refuses to order with an empty cart', async () => {
    const result = await useStore.getState().placeOrder('Test Street 1', 'COD')
    expect(result.success).toBe(false)
    expect(useStore.getState().orders).toHaveLength(0)
  })

  it('refuses to order when signed out', async () => {
    useStore.setState({ user: null })
    useStore.getState().addToCart(product)

    const result = await useStore.getState().placeOrder('Test Street 1', 'COD')
    expect(result.success).toBe(false)
  })
})
