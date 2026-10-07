"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from "@/lib/shopify"
import { isDemoMode } from "@/lib/shopify/demo"
import type { Cart } from "@/lib/shopify/types"

const CART_COOKIE = "italian_pantry_cart_id"

async function readCartId() {
  const store = await cookies()
  return store.get(CART_COOKIE)?.value ?? null
}

async function writeCartId(cartId: string) {
  const store = await cookies()
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

/** Reads the current cart. Safe to call from any server component. */
export async function fetchCart(): Promise<Cart | null> {
  if (isDemoMode()) return null
  const cartId = await readCartId()
  if (!cartId) return null

  try {
    return await getCart(cartId)
  } catch (error) {
    console.error("Failed to load cart:", error instanceof Error ? error.message : error)
    return null
  }
}

type ActionResult = { ok: true; cart: Cart } | { ok: false; error: string }

const DEMO_MESSAGE = "Preview mode: connect the Shopify store to enable the cart."

export async function addToCart(variantId: string, quantity = 1): Promise<ActionResult> {
  if (isDemoMode()) return { ok: false, error: DEMO_MESSAGE }
  try {
    const cartId = await readCartId()
    let cart: Cart

    if (cartId) {
      try {
        cart = await addCartLines(cartId, [{ merchandiseId: variantId, quantity }])
      } catch {
        // Cart expired or was completed — start a fresh one.
        cart = await createCart([{ merchandiseId: variantId, quantity }])
        await writeCartId(cart.id)
      }
    } else {
      cart = await createCart([{ merchandiseId: variantId, quantity }])
      await writeCartId(cart.id)
    }

    revalidatePath("/cart")
    return { ok: true, cart }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not add this item."
    console.error("addToCart failed:", message)
    return { ok: false, error: message }
  }
}

export async function updateCartLine(lineId: string, quantity: number): Promise<ActionResult> {
  try {
    const cartId = await readCartId()
    if (!cartId) return { ok: false, error: "No active cart." }

    const cart =
      quantity <= 0
        ? await removeCartLines(cartId, [lineId])
        : await updateCartLines(cartId, [{ id: lineId, quantity }])

    revalidatePath("/cart")
    return { ok: true, cart }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update your cart."
    console.error("updateCartLine failed:", message)
    return { ok: false, error: message }
  }
}

export async function removeCartLine(lineId: string): Promise<ActionResult> {
  try {
    const cartId = await readCartId()
    if (!cartId) return { ok: false, error: "No active cart." }

    const cart = await removeCartLines(cartId, [lineId])
    revalidatePath("/cart")
    return { ok: true, cart }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not remove this item."
    console.error("removeCartLine failed:", message)
    return { ok: false, error: message }
  }
}
