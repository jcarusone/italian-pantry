"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";
import { removeCartLine, updateCartLine } from "@/lib/shopify/cart-actions";
import type { CartLine } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export function CartLineItem({
  line,
  onNavigate,
  size = "default",
}: {
  line: CartLine;
  onNavigate?: () => void;
  size?: "default" | "compact";
}) {
  const { refresh } = useCart();
  const [isPending, startTransition] = useTransition();
  const [optimisticQty, setOptimisticQty] = useState<number | null>(null);

  const quantity = optimisticQty ?? line.quantity;
  const variantLabel = line.merchandise.selectedOptions
    .filter((option) => option.value !== "Default Title")
    .map((option) => option.value)
    .join(" · ");

  const image =
    line.merchandise.image ?? line.merchandise.product.featuredImage;

  function changeQuantity(next: number) {
    setOptimisticQty(next);
    startTransition(async () => {
      const result = await updateCartLine(line.id, next);
      if (!result.ok) {
        toast.error(result.error);
        setOptimisticQty(null);
      }
      await refresh();
      setOptimisticQty(null);
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await removeCartLine(line.id);
      if (!result.ok) toast.error(result.error);
      else toast.success(`${line.merchandise.product.title} removed`);
      await refresh();
    });
  }

  const imageSize = size === "compact" ? "h-24 w-20" : "h-32 w-26 sm:h-36 sm:w-28";

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
          "relative shrink-0 overflow-hidden rounded-md bg-secondary",
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
              className="block font-display text-[1.25rem] leading-tight text-pretty hover:text-leaf"
            >
              {line.merchandise.product.title}
            </Link>
            {variantLabel ? (
              <p className="mt-1 text-[0.875rem] text-muted-foreground">
                {variantLabel}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={remove}
            className="-mr-1.5 -mt-1 shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-frantoio/8 hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden="true" />
            <span className="sr-only">
              Remove {line.merchandise.product.title}
            </span>
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center rounded-full border border-frantoio/20">
            <button
              type="button"
              onClick={() => changeQuantity(quantity - 1)}
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <Minus className="size-3" aria-hidden="true" />
              <span className="sr-only">Decrease quantity</span>
            </button>
            <span
              className="w-8 text-center text-sm tabular-nums"
              aria-live="polite"
            >
              {isPending ? (
                <Loader2
                  className="mx-auto size-3 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                quantity
              )}
            </span>
            <button
              type="button"
              onClick={() => changeQuantity(quantity + 1)}
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <Plus className="size-3" aria-hidden="true" />
              <span className="sr-only">Increase quantity</span>
            </button>
          </div>

          <span className="font-semibold tabular-nums">
            {formatPrice(line.cost.totalAmount)}
          </span>
        </div>
      </div>
    </li>
  );
}
