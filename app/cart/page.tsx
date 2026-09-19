import type { Metadata } from "next"
import { CartView } from "@/components/cart/cart-view"

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your cart and continue to secure checkout.",
}

export default function CartPage() {
  return (
    <div className="site-container py-14 pb-24 sm:py-20">
      <header>
        <p className="eyebrow text-muted-foreground">
          Checkout
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[0.95] uppercase sm:text-5xl">
          Your cart
        </h1>
      </header>

      <div className="mt-12">
        <CartView />
      </div>
    </div>
  )
}
