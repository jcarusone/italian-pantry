"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { useCart } from "@/components/cart/cart-provider"
import { CartLineItem } from "@/components/cart/cart-line-item"
import { CheckoutButton } from "@/components/cart/checkout-button"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/format"

export function CartView() {
  const { cart, isLoading } = useCart()

  if (isLoading && !cart) {
    return (
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-8">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="size-28 shrink-0 rounded-sm" />
              <div className="flex flex-1 flex-col gap-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-sm" />
      </div>
    )
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-foreground bg-card px-6 py-24 text-center">
        <ShoppingBag className="size-7 text-primary" aria-hidden="true" />
        <h2 className="mt-6 font-display text-3xl uppercase">Your basket is empty</h2>
        <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">
          Start with the Three Regions Tasting Set if you are not sure where to begin.
        </p>
        <Button
          render={<Link href="/shop" />}
          className="mt-8 h-12 px-7 text-[0.6875rem] font-bold tracking-[0.14em] uppercase"
        >
          Browse the cellar
        </Button>
      </div>
    )
  }

  const taxAmount = cart.cost.totalTaxAmount

  return (
    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
      <ul className="flex flex-col gap-8 border-t border-border pt-8">
        {cart.lines.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </ul>

      <aside className="border-2 border-foreground bg-card p-6 lg:sticky lg:top-28">
        <h2 className="eyebrow text-primary">Order summary</h2>

        <dl className="mt-6 flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">
              Subtotal · {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}
            </dt>
            <dd className="tabular-nums">{formatPrice(cart.cost.subtotalAmount)}</dd>
          </div>

          {taxAmount ? (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Tax</dt>
              <dd className="tabular-nums">{formatPrice(taxAmount)}</dd>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="text-muted-foreground">Calculated at checkout</dd>
          </div>

          <div className="mt-3 flex items-baseline justify-between border-t-2 border-foreground pt-4">
            <dt className="font-display text-base uppercase">Total</dt>
            <dd className="font-display text-2xl tabular-nums">
              {formatPrice(cart.cost.totalAmount)}
            </dd>
          </div>
        </dl>

        <div className="mt-7">
          <CheckoutButton
            checkoutUrl={cart.checkoutUrl}
            className="h-12 text-[0.6875rem] font-bold tracking-[0.14em] uppercase"
          />
        </div>

        <Link
          href="/shop"
          className="mt-4 block text-center text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Continue shopping
        </Link>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          Secure checkout handled by Shopify. Free shipping on orders over $75.
        </p>
      </aside>
    </div>
  )
}
