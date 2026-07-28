import type { Metadata } from "next"
import Link from "next/link"
import { getCollections, getProducts } from "@/lib/shopify"
import { ProductCard } from "@/components/product/product-card"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Single-origin Italian extra virgin olive oils, aged balsamic vinegar, and bronze-cut pasta, imported direct from the producer.",
}

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Newest", value: "newest" },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]["value"]

const SORT_MAP: Record<SortValue, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: "BEST_SELLING", reverse: false },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  newest: { sortKey: "CREATED_AT", reverse: true },
}

export default async function ShopPage(props: {
  searchParams: Promise<{ collection?: string; sort?: string }>
}) {
  const searchParams = await props.searchParams
  const activeCollection = searchParams.collection ?? "all"
  const activeSort = (
    Object.keys(SORT_MAP).includes(searchParams.sort ?? "") ? searchParams.sort : "featured"
  ) as SortValue

  const { sortKey, reverse } = SORT_MAP[activeSort]

  const [collections, products] = await Promise.all([
    getCollections(),
    getProducts({
      collectionHandle: activeCollection === "all" ? undefined : activeCollection,
      sortKey,
      reverse,
      first: 60,
    }),
  ])

  const tabs = [{ handle: "all", title: "Everything" }, ...collections]

  const buildHref = (collection: string, sort: SortValue) => {
    const params = new URLSearchParams()
    if (collection !== "all") params.set("collection", collection)
    if (sort !== "featured") params.set("sort", sort)
    const query = params.toString()
    return query ? `/shop?${query}` : "/shop"
  }

  return (
    <div className="pb-20 sm:pb-28">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="eyebrow text-muted-foreground">
            The Cellar
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[0.95] uppercase text-balance sm:text-5xl md:text-6xl">
            Everything we import
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground text-pretty">
            Every bottle carries a harvest date, a named cultivar, and a single country of origin. We
            buy from eleven families and nobody else.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 border-b border-border py-6 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Filter by category" className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const isActive = tab.handle === activeCollection
              return (
                <Link
                  key={tab.handle}
                  href={buildHref(tab.handle, activeSort)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "border px-4 py-2 eyebrow transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {tab.title}
                </Link>
              )
            })}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-muted-foreground">
              Sort
            </span>
            {SORT_OPTIONS.map((option) => {
              const isActive = option.value === activeSort
              return (
                <Link
                  key={option.value}
                  href={buildHref(activeCollection, option.value)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "text-sm transition-colors",
                    isActive
                      ? "text-foreground underline decoration-primary decoration-2 underline-offset-4"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option.label}
                </Link>
              )
            })}
          </div>
        </div>

        {products.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">
            Nothing in this category yet. Please check back soon.
          </p>
        ) : (
          <>
            <p className="pt-8 eyebrow text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 pt-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
