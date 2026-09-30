import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { products as initialProducts } from '../Data/products'
import type { CartItem, Order, Product } from '../types/products'
import type { User } from '../types/user'

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9841',
    customerName: 'Ahmad Khan',
    customerEmail: 'ahmad@example.com',
    items: [
      { productId: 1, name: 'Clinge Bag', price: 1200, quantity: 1, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1bag-FBQno98AXtDnWi56egdllGVc7VzuKu.png' },
      { productId: 3, name: 'Multipurpose', price: 100, quantity: 2, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3bag%201-KmZR532uMH3mKNoSf9iidz8vYwrCUn.png' }
    ],
    totalAmount: 1420,
    status: 'DELIVERED',
    paymentMethod: 'ONLINE',
    address: 'Sector F-7/2, Street 14, Islamabad',
    createdAt: '2026-09-27T10:30:00.000Z'
  },
  {
    id: 'ORD-9842',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    items: [
      { productId: 4, name: 'Pink Attack', price: 1400, quantity: 1, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4bag-yIrF5Nuv08gDwAP1NFlkYLFFBvWeSs.png' }
    ],
    totalAmount: 1070,
    status: 'SHIPPED',
    paymentMethod: 'CARD',
    address: '42 Pine Crest Ave, Brooklyn, NY',
    createdAt: '2026-09-28T14:15:00.000Z'
  },
  {
    id: 'ORD-9843',
    customerName: 'Zainab Fatima',
    customerEmail: 'zainab@example.com',
    items: [
      { productId: 7, name: 'Supreme', price: 1800, quantity: 1, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7bag-clXxb35jz7zrf27hE4KEEIkLyLzc1x.png' },
      { productId: 2, name: 'Backpack', price: 1100, quantity: 1, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2bag-4sM5bW2NZaQV9kZRIDbmY6i1nuDivM.png' }
    ],
    totalAmount: 2920,
    status: 'PROCESSING',
    paymentMethod: 'COD',
    address: 'Gulberg III, Main Boulevard, Lahore',
    createdAt: '2026-09-29T09:45:00.000Z'
  },
  {
    id: 'ORD-9844',
    customerName: 'Hamza Malik',
    customerEmail: 'hamza.m@example.com',
    items: [
      { productId: 5, name: 'The Stud', price: 1100, quantity: 2, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5bag-C1s34qoIKwrXx6Y8VM0PX5qx2vNnqf.png' }
    ],
    totalAmount: 2220,
    status: 'PENDING',
    paymentMethod: 'COD',
    address: 'DHA Phase 5, Commercial Area, Karachi',
    createdAt: '2026-09-29T18:20:00.000Z'
  }
]

// Default Admin Owner matching the user's uploaded screenshot
const DEFAULT_ADMIN: User = {
  id: 'usr_admin_01',
  fullName: 'Muhammad',
  email: 'owner@example.com',
  username: 'muhammad_admin',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
}

interface StoreContextValue {
  user: User | null
  products: Product[]
  cartItems: CartItem[]
  orders: Order[]
  login: (email: string, password?: string, asOwner?: boolean) => Promise<boolean>
  register: (fullName: string, email: string, password?: string) => Promise<boolean>
  logout: () => void
  addToCart: (product: Product) => void
  updateQuantity: (productId: number | string, nextQuantity: number) => void
  removeFromCart: (productId: number | string) => void
  clearCart: () => void
  addProduct: (product: Omit<Product, 'id'>) => void
  removeProduct: (productId: number | string) => void
  clearProducts: () => void
  placeOrder: (address: string, paymentMethod?: 'COD' | 'ONLINE' | 'CARD') => Promise<{ success: boolean; orderId?: string; message?: string }>
  updateOrderStatus: (orderId: string, status: Order['status']) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  // Initialize user from localStorage or default to Muhammad Admin
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('scatch_user')
      if (saved) return JSON.parse(saved)
      return DEFAULT_ADMIN // Defaults to logged in admin as seen in the user's screenshot
    } catch {
      return DEFAULT_ADMIN
    }
  })

  // Initialize products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('scatch_products')
      return saved ? JSON.parse(saved) : initialProducts
    } catch {
      return initialProducts
    }
  })

  // Initialize cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('scatch_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Initialize orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('scatch_orders')
      return saved ? JSON.parse(saved) : INITIAL_ORDERS
    } catch {
      return INITIAL_ORDERS
    }
  })

  // Synchronize with local storage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('scatch_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('scatch_user')
      }
    } catch (e) {
      console.error(e)
    }
  }, [user])

  useEffect(() => {
    try {
      localStorage.setItem('scatch_products', JSON.stringify(products))
    } catch (e) {
      console.error(e)
    }
  }, [products])

  useEffect(() => {
    try {
      localStorage.setItem('scatch_cart', JSON.stringify(cartItems))
    } catch (e) {
      console.error(e)
    }
  }, [cartItems])

  useEffect(() => {
    try {
      localStorage.setItem('scatch_orders', JSON.stringify(orders))
    } catch (e) {
      console.error(e)
    }
  }, [orders])

  // Try fetching products from backend API if available
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.products && data.data.products.length > 0) {
          setProducts(data.data.products)
        }
      })
      .catch(() => {
        // Backend not active, fallback to localStorage/initialProducts
      })
  }, [])

  const login = async (email: string, password = '', asOwner = false): Promise<boolean> => {
    try {
      const endpoint = asOwner
        ? 'http://localhost:8000/api/v1/users/owner-login'
        : 'http://localhost:8000/api/v1/users/login'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'password123' })
      })

      if (res.ok) {
        const result = await res.json()
        const backendUser = result.data.user
        const mappedUser: User = {
          id: backendUser._id || backendUser.id,
          fullName: backendUser.fullName,
          email: backendUser.email,
          username: backendUser.username,
          role: backendUser.role || (asOwner ? 'admin' : 'user'),
          avatar: DEFAULT_ADMIN.avatar
        }
        setUser(mappedUser)
        return true
      }
    } catch {
      // Offline fallback
    }

    // Client-side fallback login
    const namePart = email.split('@')[0]
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1)
    const fallbackUser: User = {
      id: `usr_${Date.now()}`,
      fullName: asOwner ? 'Muhammad' : formattedName,
      email,
      role: asOwner ? 'admin' : 'user',
      avatar: asOwner ? DEFAULT_ADMIN.avatar : undefined
    }
    setUser(fallbackUser)
    return true
  }

  const register = async (fullName: string, email: string, password = ''): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password: password || 'password123' })
      })

      if (res.ok) {
        const result = await res.json()
        const backendUser = result.data.user
        setUser({
          id: backendUser._id || backendUser.id,
          fullName: backendUser.fullName,
          email: backendUser.email,
          role: 'user'
        })
        return true
      }
    } catch {
      // Offline fallback
    }

    const fallbackUser: User = {
      id: `usr_${Date.now()}`,
      fullName,
      email,
      role: 'user'
    }
    setUser(fallbackUser)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('scatch_user')
    fetch('http://localhost:8000/api/v1/users/logout', { method: 'POST' }).catch(() => {})
  }

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.id) === String(product.id))
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number | string, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => String(item.id) !== String(productId)))
      return
    }

    setCartItems((prev) =>
      prev.map((item) => (String(item.id) === String(productId) ? { ...item, quantity: nextQuantity } : item))
    )
  }

  const removeFromCart = (productId: number | string) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(productId)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now()
    }
    setProducts((prev) => [newProduct, ...prev])

    // Also inform backend if available
    fetch('http://localhost:8000/api/v1/products/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).catch(() => {})
  }

  const removeProduct = (productId: number | string) => {
    setProducts((prev) => prev.filter((item) => String(item.id) !== String(productId)))
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(productId)))

    fetch(`http://localhost:8000/api/v1/products/${productId}`, {
      method: 'DELETE'
    }).catch(() => {})
  }

  const clearProducts = () => {
    setProducts([])
    setCartItems([])
    fetch('http://localhost:8000/api/v1/products/clear-all', {
      method: 'DELETE'
    }).catch(() => {})
  }

  const placeOrder = async (
    address: string,
    paymentMethod: 'COD' | 'ONLINE' | 'CARD' = 'COD'
  ): Promise<{ success: boolean; orderId?: string; message?: string }> => {
    if (!user) {
      return { success: false, message: 'Please login to complete your order' }
    }

    if (cartItems.length === 0) {
      return { success: false, message: 'Your cart is empty' }
    }

    const totalMrp = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discountAmount = cartItems.reduce((sum, item) => {
      const discount = item.discountPercent ? Math.round((item.price * item.discountPercent) / 100) : 0
      return sum + discount * item.quantity
    }, 0)
    const platformFee = 20
    const totalAmount = totalMrp - discountAmount + platformFee

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
    const newOrder: Order = {
      id: orderId,
      customerName: user.fullName,
      customerEmail: user.email,
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount,
      status: 'PENDING',
      paymentMethod,
      address,
      createdAt: new Date().toISOString()
    }

    // Deduct stock in products
    setProducts((prev) =>
      prev.map((p) => {
        const inCart = cartItems.find((ci) => String(ci.id) === String(p.id))
        if (inCart) {
          return { ...p, stock: Math.max(0, p.stock - inCart.quantity) }
        }
        return p
      })
    )

    // Add to orders list
    setOrders((prev) => [newOrder, ...prev])
    clearCart()

    return { success: true, orderId, message: 'Order placed successfully!' }
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    )
  }

  const value = useMemo(
    () => ({
      user,
      products,
      cartItems,
      orders,
      login,
      register,
      logout,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      addProduct,
      removeProduct,
      clearProducts,
      placeOrder,
      updateOrderStatus
    }),
    [user, products, cartItems, orders]
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
