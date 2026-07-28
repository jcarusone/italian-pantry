"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useTransition } from "react"
import { Loader2, Minus, Plus, X } from "lucide-react"
import { toast } from "sonner"

import { useCart } from "@/components/cart/cart-provider"
import { formatPrice } from "@/lib/format"
import { removeCartLine, updateCartLine } from "@/lib/shopify/cart-actions"
import type { CartLine } from "@/lib/shopify/types"
import { cn } from "@/lib/utils"

export function CartLineItem({
  line,
  onNavigate,
  size = "default",
}: {
  line: CartLine
  onNavigate?: () => void
  size?: "default" | "compact"
}) {
  const { refresh } = useCart()
  const [isPending, startTransition] = useTransition()
  const [optimisticQty, setOptimisticQty] = useState<number | null>(null)

  const quantity = optimisticQty ?? line.quantity
  const variantLabel = line.merchandise.selectedOptions
    .filter((option) => option.value !== "Default Title")
    .map((option) => option.value)
    .join(" · ")

  const image = line.merchandise.image ?? line.merchandise.product.featuredImage

  function changeQuantity(next: number) {
    setOptimisticQty(next)
    startTransition(async () => {
      const result = await updateCartLine(line.id, next)
      if (!result.ok) {
        toast.error(result.error)
        setOptimisticQty(null)
      }
      await refresh()
      setOptimisticQty(null)
    })
  }

  function remove() {
    startTransition(async () => {
      const result = await removeCartLine(line.id)
      if (!result.ok) toast.error(result.error)
      else toast.success(`${line.merchandise.product.title} removed`)
      await refresh()
    })
  }

  const imageSize = size === "compact" ? "size-20" : "size-24 sm:size-28"

  return (
    <li
      className={cn(
        "flex gap-4 transition-opacity",
        isPending && "pointer-events-none opacity-60",
      )}
    >
      <Link
        href={`/products/${line.merchandise.product.handle}`}
        onClick={onNavigate}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-sm bg-secondary",
          imageSize,
        )}
      >
        {image ? (
          <Image
            src={image.url || "/placeholder.svg"}
            alt={image.altText ?? line.merchandise.product.title}
            fill
            sizes="120px"
            className="object-cover"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${line.merchandise.product.handle}`}
              onClick={onNavigate}
              className="block text-sm leading-snug font-medium text-pretty hover:text-primary"
            >
              {line.merchandise.product.title}
            </Link>
            {variantLabel ? (
              <p className="mt-1 text-xs text-muted-foreground">{variantLabel}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={remove}
            className="-mr-1 -mt-1 shrink-0 rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Remove {line.merchandise.product.title}</span>
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center rounded-sm border border-border">
            <button
              type="button"
              onClick={() => changeQuantity(quantity - 1)}
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <Minus className="size-3" aria-hidden="true" />
              <span className="sr-only">Decrease quantity</span>
            </button>
            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
              {isPending ? (
                <Loader2 className="mx-auto size-3 animate-spin" aria-hidden="true" />
              ) : (
                quantity
              )}
            </span>
            <button
              type="button"
              onClick={() => changeQuantity(quantity + 1)}
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <Plus className="size-3" aria-hidden="true" />
              <span className="sr-only">Increase quantity</span>
            </button>
          </div>

          <span className="text-sm tabular-nums">{formatPrice(line.cost.totalAmount)}</span>
        </div>
      </div>
    </li>
  )
}
