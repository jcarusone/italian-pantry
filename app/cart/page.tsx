import type { Metadata } from "next"
import { CartView } from "@/components/cart/cart-view"

export const metadata: Metadata = {
  title: "Your Basket",
  description: "Review your basket and continue to secure checkout.",
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 pb-24 sm:px-8 sm:py-20">
      <header>
        <p className="eyebrow text-muted-foreground">
          Checkout
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[0.95] uppercase sm:text-5xl">
          Your basket
        </h1>
      </header>

      <div className="mt-12">
        <CartView />
      </div>
    </div>
  )
}
