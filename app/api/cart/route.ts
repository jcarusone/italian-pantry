import { NextResponse } from "next/server"

import { fetchCart } from "@/lib/shopify/cart-actions"

export const dynamic = "force-dynamic"

export async function GET() {
  const cart = await fetchCart()
  return NextResponse.json({ cart })
}
