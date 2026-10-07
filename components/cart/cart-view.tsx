"use client";

import Link from "next/link";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { useCart } from "@/components/cart/cart-provider";
import { CheckoutButton } from "@/components/cart/checkout-button";
import { pillClasses } from "@/components/ui/pill";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { cart, isLoading, freeShippingThreshold } = useCart();

  if (isLoading && !cart) {
    return (
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-8">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-36 w-28 shrink-0 rounded-md" />
              <div className="flex flex-1 flex-col gap-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-5 border-t border-frantoio/15 py-20">
        <p className="font-display text-[2.5rem] leading-tight">Your pantry is empty.</p>
        <p className="max-w-md text-muted-foreground">
          Start with our flagship extra virgin olive oil, pressed in Abruzzo from olives grown in
          Abruzzo.
        </p>
        <Link href="/products" className={pillClasses("dark", "mt-3")}>
          Browse the collection
        </Link>
      </div>
    );
  }

  const taxAmount = cart.cost.totalTaxAmount;

  return (
    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
      <ul className="flex flex-col gap-8 border-t border-frantoio/15 pt-8">
        {cart.lines.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </ul>

      <aside className="rounded-2xl bg-card p-7 lg:sticky lg:top-28">
        <h2 className="font-display text-[1.75rem] leading-none">Order summary</h2>

        <dl className="mt-7 flex flex-col gap-3 text-[0.9375rem]">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">
              Subtotal, {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}
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
          <div className="mt-3 flex items-baseline justify-between border-t border-frantoio/15 pt-5">
            <dt className="font-semibold">Total</dt>
            <dd className="font-display text-[2rem] leading-none tabular-nums">
              {formatPrice(cart.cost.totalAmount)}
            </dd>
          </div>
        </dl>

        <div className="mt-8">
          <CheckoutButton checkoutUrl={cart.checkoutUrl} />
        </div>
        <Link
          href="/products"
          className="mt-4 block text-center text-[0.9375rem] font-medium underline-offset-4 hover:underline"
        >
          Continue shopping
        </Link>
        <p className="mt-6 text-center text-[0.8125rem] leading-relaxed text-muted-foreground">
          Secure checkout by Shopify. Free shipping across Canada on orders over $
          {freeShippingThreshold}.
        </p>
      </aside>
    </div>
  );
}
