"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { useCart } from "@/components/cart/cart-provider";
import { CheckoutButton } from "@/components/cart/checkout-button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { pillClasses } from "@/components/ui/pill";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { cart, isOpen, setOpen, closeCart, freeShippingThreshold } = useCart();
  const lines = cart?.lines ?? [];
  const isEmpty = lines.length === 0;

  const subtotal = Number.parseFloat(cart?.cost.subtotalAmount.amount ?? "0");
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(1, subtotal / freeShippingThreshold);

  return (
    <Drawer open={isOpen} onOpenChange={setOpen} swipeDirection="right">
      <DrawerContent className="h-full max-h-none gap-0 border-none bg-limestone p-0 sm:max-w-md">
        <DrawerHeader className="relative border-b border-frantoio/12 px-6 py-5">
          <DrawerTitle className="font-display text-[1.75rem] leading-none font-normal">
            Your cart
          </DrawerTitle>
          <DrawerDescription className="mt-1 text-[0.875rem] text-muted-foreground">
            {isEmpty
              ? "Nothing here yet."
              : `${cart?.totalQuantity} ${cart?.totalQuantity === 1 ? "item" : "items"}`}
          </DrawerDescription>
          <DrawerClose
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full transition-colors hover:bg-frantoio/8"
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Close cart</span>
          </DrawerClose>
        </DrawerHeader>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-5 px-6">
            <p className="font-display text-[2rem] leading-tight">Your pantry is empty.</p>
            <p className="text-muted-foreground">
              Start with our extra virgin olive oil from Abruzzo.
            </p>
            <Link href="/products" onClick={closeCart} className={pillClasses("dark")}>
              Browse the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-frantoio/12 px-6 py-4">
              <p className="text-[0.875rem]">
                {remaining > 0 ? (
                  <>
                    Add{" "}
                    <strong className="font-semibold">
                      {formatPrice({
                        amount: remaining.toFixed(2),
                        currencyCode: cart?.cost.subtotalAmount.currencyCode ?? "CAD",
                      })}
                    </strong>{" "}
                    more for free shipping across Canada.
                  </>
                ) : (
                  "Your order ships free anywhere in Canada."
                )}
              </p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-frantoio/10">
                <div
                  className="h-full origin-left rounded-full bg-gold transition-transform duration-700 ease-(--ease-pour)"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6" data-lenis-prevent>
              <ul className="flex flex-col gap-6">
                {lines.map((line) => (
                  <CartLineItem key={line.id} line={line} size="compact" onNavigate={closeCart} />
                ))}
              </ul>
            </div>

            <div className="border-t border-frantoio/12 bg-card px-6 py-6">
              <dl className="flex flex-col gap-2 text-[0.9375rem]">
                <div className="flex items-baseline justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-display text-[1.75rem] leading-none tabular-nums">
                    {formatPrice(cart?.cost.subtotalAmount)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between text-[0.875rem]">
                  <dt className="text-muted-foreground">Shipping and taxes</dt>
                  <dd className="text-muted-foreground">Calculated at checkout</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-3">
                {cart ? <CheckoutButton checkoutUrl={cart.checkoutUrl} /> : null}
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="text-center text-[0.9375rem] font-medium underline-offset-4 hover:underline"
                >
                  View full cart
                </Link>
              </div>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
