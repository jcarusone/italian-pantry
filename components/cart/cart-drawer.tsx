"use client"

import Link from "next/link"
import { ShoppingBag, X } from "lucide-react"

import { CartLineItem } from "@/components/cart/cart-line-item"
import { useCart } from "@/components/cart/cart-provider"
import { CheckoutButton } from "@/components/cart/checkout-button"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/format"

export function CartDrawer() {
  const { cart, isOpen, setOpen, closeCart } = useCart()
  const lines = cart?.lines ?? []
  const isEmpty = lines.length === 0

  return (
    <Drawer open={isOpen} onOpenChange={setOpen} swipeDirection="right">
      <DrawerContent className="h-full max-h-none gap-0 border-border bg-background p-0 sm:max-w-md">
        <DrawerHeader className="relative border-b border-border px-5 py-4">
          <DrawerTitle className="font-display text-xl">Your cart</DrawerTitle>
          <DrawerDescription className="text-xs">
            {isEmpty
              ? "Nothing here yet."
              : `${cart?.totalQuantity} ${cart?.totalQuantity === 1 ? "item" : "items"}`}
          </DrawerDescription>
          <DrawerClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3"
              />
            }
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <div className="flex size-14 items-center justify-center bg-secondary">
              <ShoppingBag className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-display text-lg">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Start with the oil everyone comes back for.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-sm bg-transparent"
              onClick={closeCart}
              render={<Link href="/products" />}
            >
              Browse the shop
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <ul className="flex flex-col gap-6">
                {lines.map((line) => (
                  <CartLineItem
                    key={line.id}
                    line={line}
                    size="compact"
                    onNavigate={closeCart}
                  />
                ))}
              </ul>
            </div>

            <div className="border-t border-border bg-card px-5 py-5">
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex items-baseline justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(cart?.cost.subtotalAmount)}</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="text-xs text-muted-foreground">Calculated at checkout</dd>
                </div>
              </dl>

              <Separator className="my-4" />

              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-muted-foreground">Total</span>
                <span className="font-display text-2xl tabular-nums">
                  {formatPrice(cart?.cost.totalAmount)}
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                {cart ? <CheckoutButton checkoutUrl={cart.checkoutUrl} /> : null}
                <Button
                  variant="ghost"
                  className="h-10 rounded-sm text-xs"
                  onClick={closeCart}
                  render={<Link href="/cart" />}
                >
                  View full cart
                </Button>
              </div>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
