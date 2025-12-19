export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  featured?: boolean
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  customer: CustomerInfo
  delivery: DeliveryInfo
  total: number
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled"
  createdAt: string
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
}

export interface DeliveryInfo {
  type: "delivery" | "pickup"
  address?: string
  city?: string
  zipCode?: string
  date: string
  time: string
  notes?: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}
