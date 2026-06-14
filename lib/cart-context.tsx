"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { CartItem, Product } from "./types"

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  saveOrder: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) {
      setItems(JSON.parse(saved))
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((current) => current.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((current) => current.map((item) => (item.id === productId ? { ...item, quantity } : item)))

  }
    const saveOrder = () => {
  const existingOrders = JSON.parse(
    localStorage.getItem("orders") || "[]"

  )

    const orderTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const newOrder = {
    id: Date.now(),
    items,
    total: orderTotal,
    createdAt: new Date().toISOString(),
  }

  localStorage.setItem(
    "orders",
    JSON.stringify([...existingOrders, newOrder])
  )
}

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
  value={{
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    saveOrder,
    total,
    itemCount,
  }}
>
      {children}
    </CartContext.Provider>
  )
}






export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
