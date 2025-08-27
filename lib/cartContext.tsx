'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem } from './supabase'
import toast from 'react-hot-toast'

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Local storage'dan sepeti yükle
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Sepet verisi yüklenirken hata:', error)
        localStorage.removeItem('cart')
      }
    }
  }, [])

  // Sepet değişikliklerini local storage'a kaydet
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (newItem: CartItem) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.product_id === newItem.product_id && item.size === newItem.size
      )

      if (existingItem) {
        toast.success('Ürün sepetinize eklendi!')
        return currentItems.map(item =>
          item.product_id === newItem.product_id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      } else {
        toast.success('Ürün sepetinize eklendi!')
        return [...currentItems, newItem]
      }
    })
  }

  const removeFromCart = (productId: string, size: string) => {
    setCartItems(currentItems => {
      const filteredItems = currentItems.filter(
        item => !(item.product_id === productId && item.size === size)
      )
      toast.success('Ürün sepetten çıkarıldı')
      return filteredItems
    })
  }

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size)
      return
    }

    setCartItems(currentItems =>
      currentItems.map(item =>
        item.product_id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    toast.success('Sepet temizlendi')
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  }

  return (
    <CartContext.Provider value={value}>
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
