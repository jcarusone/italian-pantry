"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { VariantPrice } from "@/components/product/product-price";
import { formatPrice } from "@/lib/format";
import { addToCart } from "@/lib/shopify/cart-actions";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export function AddToCartForm({ product }: { product: Product }) {
  const { openCart, refresh } = useCart();
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const availableVariants = product.variants;
  const [selectedId, setSelectedId] = useState<string>(
    () =>
      availableVariants.find((variant) => variant.availableForSale)?.id ??
      availableVariants[0]?.id ??
      "",
  );

  const selected = useMemo<ProductVariant | undefined>(
    () => availableVariants.find((variant) => variant.id === selectedId),
    [availableVariants, selectedId],
  );

  const hasRealOptions =
    product.options.length > 0 &&
    !(
      product.options.length === 1 &&
      product.options[0].values[0] === "Default Title"
    );

  const canPurchase =
    Boolean(selected?.availableForSale) && product.availableForSale;

  function handleAdd() {
    if (!selected) return;

    startTransition(async () => {
      const result = await addToCart(selected.id, quantity);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      await refresh();
      setJustAdded(true);
      openCart();
      window.setTimeout(() => setJustAdded(false), 2000);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {hasRealOptions ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="eyebrow text-muted-foreground">
              {product.options[0]?.name ?? "Option"}
            </span>
            {selected ? (
              <span className="text-xs text-muted-foreground">
                {selected.availableForSale ? "In stock" : "Out of stock"}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {availableVariants.map((variant) => {
              const isSelected = variant.id === selectedId;
              const label = variant.selectedOptions
                .map((option) => option.value)
                .join(" / ");

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedId(variant.id)}
                  disabled={!variant.availableForSale}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex min-w-24 flex-col items-start gap-1 rounded-lg border px-3.5 py-2.5 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-foreground/30",
                    !variant.availableForSale &&
                      "cursor-not-allowed opacity-40 line-through",
                  )}
                >
                  <span className="text-sm font-medium">{label}</span>
                  <VariantPrice
                    price={variant.price}
                    compareAtPrice={variant.compareAtPrice}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex h-12 items-center rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Minus className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Decrease quantity</span>
          </button>
          <span
            className="w-9 text-center text-sm tabular-nums"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(20, value + 1))}
            className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Increase quantity</span>
          </button>
        </div>

        <Button
          size="lg"
          onClick={handleAdd}
          disabled={!canPurchase || isPending}
          className="h-12 flex-1 rounded-lg text-sm"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : justAdded ? (
            <>
              <Check className="size-4" aria-hidden="true" />
              Added to cart
            </>
          ) : canPurchase ? (
            <>
              Add to cart
              <span className="ml-1.5 tabular-nums opacity-80 before:mr-1.5 before:opacity-50 before:content-['·']">
                {formatPrice(selected?.price)}
              </span>
            </>
          ) : (
            "Sold out"
          )}
        </Button>
      </div>
    </div>
  );
}
