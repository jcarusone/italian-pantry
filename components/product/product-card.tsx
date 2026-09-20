import Image from "next/image"
import Link from "next/link"

import { formatPrice } from "@/lib/format"
import type { Product } from "@/lib/shopify/types"
import { cn } from "@/lib/utils"

function originLabel(product: Product) {
  const regions = ["Tuscany", "Puglia", "Umbria", "Sicily", "Modena", "Amalfi"]
  return product.tags.find((tag) => regions.includes(tag)) ?? product.productType
}

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product
  priority?: boolean
  className?: string
}) {
  const onSale =
    product.compareAtPriceRange &&
    Number.parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
      Number.parseFloat(product.priceRange.minVariantPrice.amount)

  const hasRange =
    product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount

  const isSoldOut = !product.availableForSale

  return (
    <article
      className={cn(
        "group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-md",
        isSoldOut && "opacity-90",
        className,
      )}
    >
      <Link
        href={`/products/${product.handle}`}
        className="relative aspect-square overflow-hidden bg-muted/30"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url || "/placeholder.svg"}
            alt={product.featuredImage.altText ?? product.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={cn(
              "object-contain p-5 transition-transform duration-500 ease-out sm:p-6",
              !isSoldOut && "group-hover:scale-[1.03]",
            )}
          />
        ) : null}

        {isSoldOut ? (
          <div
            className="pointer-events-none absolute inset-0 bg-background/25"
            aria-hidden="true"
          />
        ) : null}

        {(onSale || isSoldOut) ? (
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            {onSale ? (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.08em] text-primary-foreground uppercase">
                Sale
              </span>
            ) : (
              <span aria-hidden="true" />
            )}
            {isSoldOut ? (
              <span className="rounded-full bg-foreground/85 px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.08em] text-background uppercase backdrop-blur-sm">
                Sold out
              </span>
            ) : null}
          </div>
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 border-t border-border/50 p-4 sm:gap-2 sm:p-5">
        <p className="eyebrow text-muted-foreground">{originLabel(product)}</p>

        <h3 className="text-[0.9375rem] font-semibold leading-snug text-pretty text-foreground sm:text-base">
          <Link
            href={`/products/${product.handle}`}
            className="transition-colors hover:text-primary"
          >
            {product.title}
          </Link>
        </h3>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-2">
          {hasRange ? (
            <span className="text-xs text-muted-foreground">From</span>
          ) : null}
          <span className="text-lg font-semibold leading-none tabular-nums sm:text-xl">
            {formatPrice(product.priceRange.minVariantPrice)}
          </span>
          {onSale && product.compareAtPriceRange ? (
            <span className="text-sm text-muted-foreground line-through tabular-nums">
              {formatPrice(product.compareAtPriceRange.minVariantPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
