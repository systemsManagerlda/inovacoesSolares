'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, CartContextType } from '@/types'

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        return JSON.parse(savedCart)
      } catch {
        return []
      }
    }
  }
  return []
})
  const [isOpen, setIsOpen] = useState(false)
  const total = items.reduce(
  (acc, item) => acc + (parseFloat(item.price) * item.quantity),
  0
)

const itemCount = items.reduce(
  (acc, item) => acc + item.quantity,
  0
)

  useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(items))
}, [items])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addItem = (product: any, quantity: number = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        slug: product.slug,
        image: product.images?.[0]?.src || '/placeholder-image.jpg',
        quantity,
        stock_status: product.stock_status
      }]
    })
    
    setIsOpen(true)
  }

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId)
      return
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      total,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}