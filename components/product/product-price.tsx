import { formatPrice } from "@/lib/format";
import type { Money } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

function isOnSale(price: Money, compareAtPrice: Money | null | undefined) {
  return compareAtPrice && Number.parseFloat(compareAtPrice.amount) > Number.parseFloat(price.amount);
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

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-4 gap-y-2", className)}>
      {hasRange ? <span className="text-[0.9375rem] text-muted-foreground">From</span> : null}
      <p className="text-[1.375rem] leading-none font-semibold tabular-nums">{formatPrice(price)}</p>
      {onSale && compareAtPrice ? (
        <>
          <span className="text-[0.9375rem] text-muted-foreground line-through tabular-nums">
            <span className="sr-only">Was </span>
            {formatPrice(compareAtPrice)}
          </span>
          <span className="rounded-full bg-pomodoro px-2.5 py-0.5 text-[0.75rem] font-semibold text-limestone">
            On sale
          </span>
        </>
      ) : null}
    </div>
  );
}
