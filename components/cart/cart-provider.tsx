"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import useSWR from "swr"

import type { Cart } from "@/lib/shopify/types"

type CartContextValue = {
  cart: Cart | null
  isLoading: boolean
  totalQuantity: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  setOpen: (open: boolean) => void
  refresh: () => Promise<unknown>
}

const CartContext = createContext<CartContextValue | null>(null)

const fetcher = async (url: string): Promise<{ cart: Cart | null }> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load cart")
  return res.json()
}

export function CartProvider({
  children,
  initialCart,
}: {
  children: React.ReactNode
  initialCart: Cart | null
}) {
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading, mutate } = useSWR("/api/cart", fetcher, {
    fallbackData: { cart: initialCart },
    revalidateOnFocus: true,
  })

  const cart = data?.cart ?? null

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const refresh = useCallback(() => mutate(), [mutate])

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isLoading,
      totalQuantity: cart?.totalQuantity ?? 0,
      isOpen,
      openCart,
      closeCart,
      setOpen: setIsOpen,
      refresh,
    }),
    [cart, isLoading, isOpen, openCart, closeCart, refresh],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used inside a CartProvider")
  return context
}
