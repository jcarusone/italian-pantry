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

  return (
    <article
      className={cn(
        "group flex flex-col border-2 border-foreground bg-card transition-colors hover:bg-accent",
        className,
      )}
    >
      <Link
        href={`/products/${product.handle}`}
        className="relative aspect-square overflow-hidden border-b-2 border-foreground bg-secondary"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url || "/placeholder.svg"}
            alt={product.featuredImage.altText ?? product.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 24vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : null}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2">
          {onSale ? (
            <span className="bg-foreground px-2.5 py-1.5 text-[0.625rem] font-bold tracking-[0.14em] text-background uppercase">
              Sale
            </span>
          ) : (
            <span />
          )}
          {!product.availableForSale ? (
            <span className="bg-foreground px-2.5 py-1.5 text-[0.625rem] font-bold tracking-[0.14em] text-background uppercase">
              Sold out
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="eyebrow text-muted-foreground group-hover:text-foreground/70">
          {originLabel(product)}
        </p>

        <h3 className="font-display text-base leading-[1.1] text-pretty uppercase">
          <Link href={`/products/${product.handle}`}>{product.title}</Link>
        </h3>

        <div className="mt-auto flex items-baseline gap-2 pt-3">
          {hasRange ? (
            <span className="eyebrow text-muted-foreground group-hover:text-foreground/70">
              From
            </span>
          ) : null}
          <span className="font-display text-2xl leading-none tabular-nums">
            {formatPrice(product.priceRange.minVariantPrice)}
          </span>
          {onSale && product.compareAtPriceRange ? (
            <span className="text-xs text-muted-foreground line-through tabular-nums group-hover:text-foreground/70">
              {formatPrice(product.compareAtPriceRange.minVariantPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
