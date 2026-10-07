import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

const REGIONS = ["Abruzzo", "Campania", "Puglia", "Sicily", "Tuscany", "Umbria", "Calabria"];

function detailLine(product: Product) {
  const region = product.tags.find((tag) => REGIONS.includes(tag));
  if (region && product.productType) return `${product.productType}, ${region}`;
  return region ?? product.productType;
}

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const onSale =
    product.compareAtPriceRange &&
    Number.parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
      Number.parseFloat(product.priceRange.minVariantPrice.amount);

  const hasRange =
    product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;

  const isSoldOut = !product.availableForSale;
  const detail = detailLine(product);

  return (
    <article className={cn("group relative flex min-w-0 flex-col", className)}>
      <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-secondary outline-offset-4 group-has-[a:focus-visible]:outline-2 group-has-[a:focus-visible]:outline-leaf">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url || "/placeholder.svg"}
            alt={product.featuredImage.altText ?? product.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
            className={cn(
              "object-contain p-5 sm:p-6",
              isSoldOut && "opacity-60 grayscale-[40%]",
            )}
          />
        ) : null}

        {onSale || isSoldOut ? (
          <span
            className={cn(
              "absolute top-3 left-3 rounded-full px-3 py-1 text-[0.75rem] font-semibold",
              isSoldOut ? "bg-frantoio/85 text-limestone" : "bg-pomodoro text-limestone",
            )}
          >
            {isSoldOut ? "Sold out" : "On sale"}
          </span>
        ) : null}

        <span
          aria-hidden="true"
          className="absolute inset-x-3 bottom-3 flex h-11 translate-y-[calc(100%+1rem)] items-center justify-center rounded-full bg-limestone/90 text-[0.875rem] font-semibold text-frantoio backdrop-blur transition-transform duration-500 ease-(--ease-pour) group-hover:translate-y-0 group-focus-within:translate-y-0"
        >
          View product
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-4">
        <h3 className="font-display text-[1.25rem] leading-[1.2] text-pretty">
          <Link
            href={`/products/${product.handle}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {product.title}
          </Link>
        </h3>
        <div className="mt-auto flex flex-col-reverse gap-0.5 pt-1 text-[0.9375rem] sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          {detail ? (
            <span className="text-[0.875rem] text-muted-foreground sm:truncate sm:text-[0.9375rem]">{detail}</span>
          ) : (
            <span />
          )}
          <span className="shrink-0 text-[0.9375rem] font-semibold tabular-nums">
            {hasRange ? <span className="font-normal text-muted-foreground">From </span> : null}
            {formatPrice(product.priceRange.minVariantPrice)}
            {onSale && product.compareAtPriceRange ? (
              <span className="ml-2 font-normal text-muted-foreground line-through">
                {formatPrice(product.compareAtPriceRange.minVariantPrice)}
              </span>
            ) : null}
          </span>
        </div>
      </div>
    </article>
  );
}
