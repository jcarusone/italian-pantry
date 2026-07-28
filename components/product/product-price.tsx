import { formatPrice } from "@/lib/format";
import type { Money } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

function isOnSale(price: Money, compareAtPrice: Money | null | undefined) {
  return (
    compareAtPrice &&
    Number.parseFloat(compareAtPrice.amount) > Number.parseFloat(price.amount)
  );
}

function savePercent(price: Money, compareAtPrice: Money) {
  return Math.round(
    (1 -
      Number.parseFloat(price.amount) /
        Number.parseFloat(compareAtPrice.amount)) *
      100,
  );
}

export function ProductPrice({
  price,
  compareAtPrice,
  hasRange = false,
  className,
}: {
  price: Money;
  compareAtPrice?: Money | null;
  hasRange?: boolean;
  className?: string;
}) {
  const onSale = isOnSale(price, compareAtPrice);
  const discount =
    onSale && compareAtPrice ? savePercent(price, compareAtPrice) : null;

  return (
    <div className={cn("border-y border-border py-5", className)}>
      {onSale ? (
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="bg-foreground px-2.5 py-1.5 eyebrow text-background">
            On sale
          </span>
          {discount ? (
            <span className="eyebrow text-primary">{discount}% off</span>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
        {hasRange ? (
          <span className="eyebrow mb-1.5 text-muted-foreground">From</span>
        ) : null}

        <p className="font-display text-[2.5rem] leading-none tracking-[-0.04em] tabular-nums sm:text-[2.75rem]">
          {formatPrice(price)}
        </p>

        {onSale && compareAtPrice ? (
          <div className="mb-1 flex flex-col gap-1">
            <span className="eyebrow text-muted-foreground">
              Original Price
            </span>
            <span className="text-base leading-none text-muted-foreground line-through decoration-border tabular-nums sm:text-lg">
              {formatPrice(compareAtPrice)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function VariantPrice({
  price,
  compareAtPrice,
  className,
}: {
  price: Money;
  compareAtPrice?: Money | null;
  className?: string;
}) {
  const onSale = isOnSale(price, compareAtPrice);

  return (
    <span className={cn("flex flex-col gap-0.5 tabular-nums", className)}>
      <span
        className={cn(
          "text-sm",
          onSale ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
      >
        {formatPrice(price)}
      </span>
      {onSale && compareAtPrice ? (
        <span className="text-[0.625rem] leading-none text-muted-foreground line-through">
          {formatPrice(compareAtPrice)}
        </span>
      ) : null}
    </span>
  );
}
