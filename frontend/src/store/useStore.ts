import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products as initialProducts } from '@/data/products'
import type { CartItem, Order, OrderItem, Product } from '@/types/products'
import type { User } from '@/types/user'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'
const PLATFORM_FEE = 20

const DEMO_ADMIN: User = {
  id: 'usr_admin_01',
  fullName: 'Muhammad',
  email: 'owner@example.com',
  username: 'muhammad_admin',
  role: 'admin',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9841',
    customerName: 'Ahmad Khan',
    customerEmail: 'ahmad@example.com',
    items: [
      {
        productId: 1,
        name: 'Clinge Bag',
        price: 1200,
        quantity: 1,
        image:
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1bag-FBQno98AXtDnWi56egdllGVc7VzuKu.png',
      },
      {
        productId: 3,
        name: 'Multipurpose',
        price: 100,
        quantity: 2,
        image:
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3bag%201-KmZR532uMH3mKNoSf9iidz8vYwrCUn.png',
      },
    ],
    totalAmount: 1420,
    status: 'DELIVERED',
    paymentMethod: 'ONLINE',
    address: 'Sector F-7/2, Street 14, Islamabad',
    createdAt: '2026-09-27T10:30:00.000Z',
  },
  {
    id: 'ORD-9842',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    items: [
      {
        productId: 4,
        name: 'Pink Attack',
        price: 1400,
        quantity: 1,
        image:
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4bag-yIrF5Nuv08gDwAP1NFlkYLFFBvWeSs.png',
      },
    ],
    totalAmount: 1070,
    status: 'SHIPPED',
    paymentMethod: 'CARD',
    address: '42 Pine Crest Ave, Brooklyn, NY',
    createdAt: '2026-09-28T14:15:00.000Z',
  },
  {
    id: 'ORD-9843',
    customerName: 'Zainab Fatima',
    customerEmail: 'zainab@example.com',
    items: [
      {
        productId: 7,
        name: 'Supreme',
        price: 1800,
        quantity: 1,
        image:
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7bag-clXxb35jz7zrf27hE4KEEIkLyLzc1x.png',
      },
      {
        productId: 2,
        name: 'Backpack',
        price: 1100,
        quantity: 1,
        image:
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2bag-4sM5bW2NZaQV9kZRIDbmY6i1nuDivM.png',
      },
    ],
    totalAmount: 2920,
    status: 'PROCESSING',
    paymentMethod: 'COD',
    address: 'Gulberg III, Main Boulevard, Lahore',
    createdAt: '2026-09-29T09:45:00.000Z',
  },
  {
    id: 'ORD-9844',
    customerName: 'Hamza Malik',
    customerEmail: 'hamza.m@example.com',
    items: [
      {
        productId: 5,
        name: 'The Stud',
        price: 1100,
        quantity: 2,
        image:
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5bag-C1s34qoIKwrXx6Y8VM0PX5qx2vNnqf.png',
      },
    ],
    totalAmount: 2220,
    status: 'PENDING',
    paymentMethod: 'COD',
    address: 'DHA Phase 5, Commercial Area, Karachi',
    createdAt: '2026-09-29T18:20:00.000Z',
  },
]

export interface PlaceOrderResult {
  success: boolean
  orderId?: string
  message?: string
}

interface StoreState {
  user: User | null
  products: Product[]
  cartItems: CartItem[]
  orders: Order[]
  productsStatus: 'idle' | 'loading' | 'ready' | 'error'
}

interface StoreActions {
  fetchProducts: () => Promise<void>
  login: (email: string, password?: string, asOwner?: boolean) => Promise<boolean>
  register: (fullName: string, email: string, password?: string) => Promise<boolean>
  logout: () => void
  addToCart: (product: Product, quantity?: number) => void
  updateQuantity: (productId: Product['id'], nextQuantity: number) => void
  removeFromCart: (productId: Product['id']) => void
  clearCart: () => void
  addProduct: (product: Omit<Product, 'id'>) => void
  removeProduct: (productId: Product['id']) => void
  clearProducts: () => void
  placeOrder: (address: string, paymentMethod?: Order['paymentMethod']) => Promise<PlaceOrderResult>
  updateOrderStatus: (orderId: string, status: Order['status']) => void
}

export type Store = StoreState & StoreActions

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      ...init,
    })
    if (!res.ok) return null
    const payload = (await res.json()) as { data?: T }
    return (payload.data ?? null) as T | null
  } catch {
    return null
  }
}

function mapBackendUser(raw: Record<string, unknown>, fallbackRole: User['role']): User {
  const role = raw['role']
  return {
    id: String(raw['_id'] ?? raw['id'] ?? `usr_${Date.now()}`),
    fullName: String(raw['fullName'] ?? 'Scatch Customer'),
    email: String(raw['email'] ?? ''),
    username: typeof raw['username'] === 'string' ? raw['username'] : undefined,
    role: role === 'admin' || role === 'owner' ? role : fallbackRole,
    avatar: typeof raw['avatar'] === 'string' ? raw['avatar'] : undefined,
  }
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: DEMO_ADMIN,
      products: initialProducts,
      cartItems: [],
      orders: INITIAL_ORDERS,
      productsStatus: 'idle',

      fetchProducts: async () => {
        set({ productsStatus: 'loading' })
        const data = await request<{ products: Product[] }>('/products')
        const remote = data?.products
        if (remote && remote.length > 0) {
          set({ products: remote, productsStatus: 'ready' })
        } else {
          set({ productsStatus: get().products.length > 0 ? 'ready' : 'error' })
        }
      },

      login: async (email, password = '', asOwner = false) => {
        const endpoint = asOwner ? '/users/owner-login' : '/users/login'
        const data = await request<{ user: Record<string, unknown> }>(endpoint, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })

        if (data?.user) {
          set({ user: mapBackendUser(data.user, asOwner ? 'admin' : 'user') })
          return true
        }

        // Offline demo fallback: only when the backend is unreachable.
        const backendReachable = await request<unknown>('/healthcheck')
        if (backendReachable !== null) return false

        const namePart = email.split('@')[0] ?? 'guest'
        set({
          user: {
            id: `usr_${Date.now()}`,
            fullName: asOwner ? DEMO_ADMIN.fullName : namePart.charAt(0).toUpperCase() + namePart.slice(1),
            email,
            role: asOwner ? 'admin' : 'user',
            avatar: asOwner ? DEMO_ADMIN.avatar : undefined,
          },
        })
        return true
      },

      register: async (fullName, email, password = '') => {
        const data = await request<{ user: Record<string, unknown> }>('/users/register', {
          method: 'POST',
          body: JSON.stringify({ fullName, email, password }),
        })

        if (data?.user) {
          set({ user: mapBackendUser(data.user, 'user') })
          return true
        }

        const backendReachable = await request<unknown>('/healthcheck')
        if (backendReachable !== null) return false

        set({ user: { id: `usr_${Date.now()}`, fullName, email, role: 'user' } })
        return true
      },

      logout: () => {
        set({ user: null })
        void request('/users/logout', { method: 'POST' })
      },

      addToCart: (product, quantity = 1) => {
        if (product.stock <= 0 || quantity <= 0) return
        set((state) => {
          const existing = state.cartItems.find((item) => String(item.id) === String(product.id))
          if (existing) {
            return {
              cartItems: state.cartItems.map((item) =>
                String(item.id) === String(product.id)
                  ? { ...item, quantity: Math.min(item.quantity + quantity, Math.max(1, product.stock)) }
                  : item,
              ),
            }
          }
          return {
            cartItems: [
              ...state.cartItems,
              { ...product, quantity: Math.min(quantity, Math.max(1, product.stock)) },
            ],
          }
        })
      },

      updateQuantity: (productId, nextQuantity) => {
        set((state) => ({
          cartItems:
            nextQuantity <= 0
              ? state.cartItems.filter((item) => String(item.id) !== String(productId))
              : state.cartItems.map((item) =>
                  String(item.id) === String(productId) ? { ...item, quantity: nextQuantity } : item,
                ),
        }))
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => String(item.id) !== String(productId)),
        }))
      },

      clearCart: () => set({ cartItems: [] }),

      addProduct: (product) => {
        const created: Product = { ...product, id: `local_${Date.now()}` }
        set((state) => ({ products: [created, ...state.products] }))
        void request('/products/create', { method: 'POST', body: JSON.stringify(created) })
      },

      removeProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((item) => String(item.id) !== String(productId)),
          cartItems: state.cartItems.filter((item) => String(item.id) !== String(productId)),
        }))
        void request(`/products/${productId}`, { method: 'DELETE' })
      },

      clearProducts: () => {
        set({ products: [], cartItems: [] })
        void request('/products/clear-all', { method: 'DELETE' })
      },

      placeOrder: async (address, paymentMethod = 'COD') => {
        const { user, cartItems } = get()
        if (!user) return { success: false, message: 'Please sign in to complete your order.' }
        if (cartItems.length === 0) return { success: false, message: 'Your cart is empty.' }

        const items: OrderItem[] = cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }))

        const totalMrp = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const discount = cartItems.reduce((sum, item) => {
          const pct = item.discountPercent ?? 0
          return sum + Math.round((item.price * pct) / 100) * item.quantity
        }, 0)
        const totalAmount = Math.max(0, totalMrp - discount + PLATFORM_FEE)
        const orderId = `ORD-${Date.now().toString().slice(-6)}`

        const order: Order = {
          id: orderId,
          customerName: user.fullName,
          customerEmail: user.email,
          items,
          totalAmount,
          status: 'PENDING',
          paymentMethod,
          address,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          orders: [order, ...state.orders],
          products: state.products.map((product) => {
            const inCart = state.cartItems.find((item) => String(item.id) === String(product.id))
            return inCart
              ? { ...product, stock: Math.max(0, product.stock - inCart.quantity) }
              : product
          }),
          cartItems: [],
        }))

        void request('/orders/create', { method: 'POST', body: JSON.stringify(order) })

        return { success: true, orderId, message: 'Order placed successfully!' }
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
        }))
      },
    }),
    {
      name: 'scatch-store',
      version: 1,
      partialize: (state) => ({
        user: state.user,
        products: state.products,
        cartItems: state.cartItems,
        orders: state.orders,
      }),
    },
  ),
)

export const selectCartCount = (state: Store): number =>
  state.cartItems.reduce((sum, item) => sum + item.quantity, 0)

export const selectCartSubtotal = (state: Store): number =>
  state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
