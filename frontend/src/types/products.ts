export interface Product {
  id: number | string
  _id?: string
  name: string
  image: string
  price: number
  description: string
  stock: number
  category: string
  bgColor: string
  panelColor: string
  textColor: string
  discountPercent?: number
  /** Optional path to a compressed .glb model for a photo-real 3D preview. */
  modelUrl?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface OrderItem {
  productId: string | number
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  totalAmount: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentMethod: 'COD' | 'ONLINE' | 'CARD'
  address: string
  createdAt: string
}
