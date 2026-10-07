"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { pillClasses } from "@/components/ui/pill";
import { formatPrice } from "@/lib/format";
import { addToCart } from "@/lib/shopify/cart-actions";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export function AddToCartForm({
  product,
  tone = "light",
}: {
  product: Product;
  /** "dark" when placed on the bottle-glass background. */
  tone?: "light" | "dark";
}) {
  const { openCart, refresh } = useCart();
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dark = tone === "dark";

  const variants = product.variants;
  const [selectedId, setSelectedId] = useState<string>(
    () => variants.find((variant) => variant.availableForSale)?.id ?? variants[0]?.id ?? "",
  );

  const selected = useMemo<ProductVariant | undefined>(
    () => variants.find((variant) => variant.id === selectedId),
    [variants, selectedId],
  );

  const hasRealOptions =
    product.options.length > 0 &&
    !(product.options.length === 1 && product.options[0].values[0] === "Default Title");

  const canPurchase = Boolean(selected?.availableForSale) && product.availableForSale;

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
        <fieldset className="flex flex-col gap-3">
          <legend className={cn("mb-2.5 text-[0.8125rem]", dark ? "text-limestone/60" : "text-muted-foreground")}>
            {product.options[0]?.name ?? "Option"}
          </legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isSelected = variant.id === selectedId;
              const label = variant.selectedOptions.map((option) => option.value).join(" / ");

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedId(variant.id)}
                  disabled={!variant.availableForSale}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex h-10 items-center gap-2.5 rounded-full border px-4 text-[0.875rem] transition-colors duration-300",
                    dark
                      ? isSelected
                        ? "border-olio bg-olio/10 text-limestone"
                        : "border-limestone/25 text-limestone/80 hover:border-limestone/60"
                      : isSelected
                        ? "border-frantoio bg-frantoio text-limestone"
                        : "border-frantoio/20 hover:border-frantoio/60",
                    !variant.availableForSale && "cursor-not-allowed line-through opacity-40",
                  )}
                >
                  <span className="font-semibold">{label}</span>
                  <span className="tabular-nums opacity-70">{formatPrice(variant.price)}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="flex items-stretch gap-3">
        <div
          className={cn(
            "flex h-11 w-fit shrink-0 items-center justify-between rounded-full border px-1",
            dark ? "border-limestone/25" : "border-frantoio/20",
          )}
        >
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="flex size-9 items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100"
          >
            <Minus className="size-3" aria-hidden="true" />
            <span className="sr-only">Decrease quantity</span>
          </button>
          <span className="w-6 text-center text-[0.875rem] tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(20, value + 1))}
            className="flex size-9 items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100"
          >
            <Plus className="size-3" aria-hidden="true" />
            <span className="sr-only">Increase quantity</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canPurchase || isPending}
          className={pillClasses(dark ? "olio" : "dark", "min-w-0 flex-1 sm:max-w-sm")}
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
              <span className="tabular-nums opacity-70">{formatPrice(selected?.price)}</span>
            </>
          ) : (
            "Sold out"
          )}
        </button>
      </div>
    </div>
  );
}
