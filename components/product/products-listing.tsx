import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { ProductCard } from "@/components/product/product-card";
import { getContent } from "@/lib/cms/content";
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
  return Object.keys(SORT_MAP).includes(sort ?? "") ? (sort as SortValue) : "featured";
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
  const [collections, shop] = await Promise.all([
    collectionsProp ? Promise.resolve(collectionsProp) : getCollections(),
    getContent("shop.page"),
  ]);

  const products = await getProducts({
    collectionHandle: activeCollection === "all" ? undefined : activeCollection,
    sortKey,
    reverse,
    first: 60,
  });

  const tabs = [{ handle: "all", title: "Everything", description: "" }, ...collections];
  const activeTab = tabs.find((tab) => tab.handle === activeCollection);
  const isAll = !activeTab || activeTab.handle === "all";

  return (
    <div className="pb-24 md:pb-36">
      <PageHeader
        key={activeCollection}
        lines={isAll ? [shop.heading] : [activeTab.title]}
        intro={isAll || !activeTab.description ? shop.intro : activeTab.description}
      />

      <div className="site-container">
        <div className="flex flex-col gap-5 border-y border-frantoio/15 py-5 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Filter by category" className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const isActive = tab.handle === activeCollection;
              return (
                <Link
                  key={tab.handle}
                  href={buildProductsHref(tab.handle, activeSort)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center rounded-full border px-5 text-[0.9375rem] font-medium transition-colors duration-300",
                    isActive
                      ? "border-frantoio bg-frantoio text-limestone"
                      : "border-frantoio/15 text-frantoio/75 hover:border-frantoio/50 hover:text-frantoio",
                  )}
                >
                  {tab.title}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.9375rem]">
            <span className="text-muted-foreground">Sort by</span>
            {SORT_OPTIONS.map((option) => {
              const isActive = option.value === activeSort;
              return (
                <Link
                  key={option.value}
                  href={buildProductsHref(activeCollection, option.value)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "font-semibold text-foreground underline decoration-gold decoration-2 underline-offset-[6px]"
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
          <div className="flex flex-col items-start gap-4 py-24">
            <p className="font-display text-3xl">Nothing on this shelf yet.</p>
            <p className="text-muted-foreground">
              New products arrive from Italy regularly.{" "}
              <Link href="/products" className="font-semibold text-foreground underline underline-offset-4">
                Browse everything
              </Link>
            </p>
          </div>
        ) : (
          <>
            <p className="pt-8 text-[0.9375rem] text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-12 pt-8 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              {products.map((product, index) => (
                <li key={product.id}>
                  <ProductCard product={product} priority={index < 4} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
