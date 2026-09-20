import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { getCollections, getProducts } from "@/lib/shopify";
import type { Collection } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Newest", value: "newest" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const SORT_MAP: Record<SortValue, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: "BEST_SELLING", reverse: false },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  newest: { sortKey: "CREATED_AT", reverse: true },
};

export function buildProductsHref(collection: string, sort: SortValue) {
  const base = collection === "all" ? "/products" : `/products/${collection}`;
  if (sort === "featured") return base;
  return `${base}?sort=${sort}`;
}

export function parseSortValue(sort: string | undefined): SortValue {
  return Object.keys(SORT_MAP).includes(sort ?? "")
    ? (sort as SortValue)
    : "featured";
}

type ProductsListingProps = {
  activeCollection: string;
  activeSort: SortValue;
  collections?: Collection[];
};

export async function ProductsListing({
  activeCollection,
  activeSort,
  collections: collectionsProp,
}: ProductsListingProps) {
  const { sortKey, reverse } = SORT_MAP[activeSort];

  const collections = collectionsProp ?? (await getCollections());

  const products = await getProducts({
    collectionHandle: activeCollection === "all" ? undefined : activeCollection,
    sortKey,
    reverse,
    first: 60,
  });

  const tabs = [{ handle: "all", title: "Everything" }, ...collections];
  const activeTab = tabs.find((tab) => tab.handle === activeCollection);

  return (
    <div className="pb-20 sm:pb-28">
      <header className="border-b border-border bg-card">
        <div className="site-container py-14 sm:py-20">
          <p className="eyebrow text-muted-foreground">The Cellar</p>
          <h1 className="mt-4 font-display text-4xl leading-[0.95] uppercase text-balance sm:text-5xl md:text-6xl">
            {activeTab && activeTab.handle !== "all"
              ? activeTab.title
              : "Everything we import"}
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground text-pretty">
            Every bottle carries a harvest date, a named cultivar, and a single
            country of origin. We buy from eleven families and nobody else.
          </p>
        </div>
      </header>

      <div className="site-container">
        <div className="flex flex-col gap-5 border-b border-border py-6 md:flex-row md:items-center md:justify-between">
          <nav
            aria-label="Filter by category"
            className="flex flex-wrap items-center gap-2"
          >
            {tabs.map((tab) => {
              const isActive = tab.handle === activeCollection;
              return (
                <Link
                  key={tab.handle}
                  href={buildProductsHref(tab.handle, activeSort)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-lg border px-4 py-2 eyebrow transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {tab.title}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-muted-foreground">Sort</span>
            {SORT_OPTIONS.map((option) => {
              const isActive = option.value === activeSort;
              return (
                <Link
                  key={option.value}
                  href={buildProductsHref(activeCollection, option.value)}
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
              );
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
            <div className="grid grid-cols-1 gap-5 gap-y-12 pt-8 min-[480px]:grid-cols-2 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
