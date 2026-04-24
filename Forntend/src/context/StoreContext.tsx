import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { products as initialProducts } from '../Data/products'
import type { CartItem, Product } from '../types/products'

interface StoreContextValue {
  products: Product[]
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  updateQuantity: (productId: number, nextQuantity: number) => void
  removeFromCart: (productId: number) => void
  addProduct: (product: Omit<Product, 'id'>) => void
  removeProduct: (productId: number) => void
  clearProducts: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId))
      return
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: nextQuantity } : item)),
    )
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts((prev) => [{ ...product, id: Date.now() }, ...prev])
  }

  const removeProduct = (productId: number) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId))
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearProducts = () => {
    setProducts([])
    setCartItems([])
  }

  const value = useMemo(
    () => ({
      products,
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      addProduct,
      removeProduct,
      clearProducts,
    }),
    [products, cartItems],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used inside StoreProvider')
  }
  return context
}
