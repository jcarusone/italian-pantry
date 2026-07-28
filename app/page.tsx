import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Droplets, Leaf, MapPin, Ship } from "lucide-react";

import { ArticleCard } from "@/components/journal/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { getArticles, getCollectionProducts, getProducts } from "@/lib/shopify";

export const revalidate = 300;

const PROMISES = [
  {
    icon: MapPin,
    title: "One estate, one bottle",
    body: "No blending across borders. Each oil is pressed from a single named grove we have visited in person.",
  },
  {
    icon: Leaf,
    title: "Harvest dated, always",
    body: "Olive oil is a fruit juice. We print the harvest month on every label so you know how fresh it really is.",
  },
  {
    icon: Droplets,
    title: "Cold extracted under 27°C",
    body: "Milled within hours of picking to protect the polyphenols that give good oil its pepper and bite.",
  },
  {
    icon: Ship,
    title: "Shipped from Brooklyn",
    body: "Stored in a temperature-controlled room, never a sunlit warehouse. Orders leave within one business day.",
  },
];

const TICKER = [
  "Tuscany",
  "Puglia",
  "Umbria",
  "Sicily",
  "Cold extracted",
  "Harvest dated",
  "Single origin",
];

export default async function HomePage() {
  const [featured, oliveOils, articles] = await Promise.all([
    getProducts({ first: 4, sortKey: "BEST_SELLING" }),
    getCollectionProducts("olive-oil"),
    getArticles(3),
  ]);

  // The spotlight is specifically an olive-oil feature, so source it from the
  // olive oil collection rather than the best-sellers (which can be pantry goods).
  const hero = oliveOils.products[0] ?? featured[0] ?? null;

  // Shopify's plain-text `description` strips block tags without adding whitespace,
  // so paragraphs collapse into "...card.The set...". Re-split on the lost boundary,
  // keep the lede, and truncate on a word boundary.
  const heroSummary = (() => {
    if (!hero) return "";
    const lede = hero.description.split(/(?<=[.!?])(?=[A-Z])/)[0].trim();
    return lede.length > 240
      ? `${lede.slice(0, 240).replace(/\s+\S*$/, "")}…`
      : lede;
  })();

  const REGIONS = ["Tuscany", "Puglia", "Umbria", "Sicily"];
  const heroRegion = hero?.tags.find((tag) =>
    REGIONS.some((region) => region.toLowerCase() === tag.toLowerCase()),
  );

  return (
    <>
      {/* Oversized wordmark lockup */}
      <section className="border-b-2 border-foreground">
        <h1 className="sr-only">
          Italian Pantry — single-estate Italian olive oil and pantry goods
        </h1>
        <p
          aria-hidden="true"
          className="wordmark w-full px-2 py-4 tracking-wide text-center text-[clamp(2.5rem,10.2vw,11rem)] text-foreground"
        >
          Italian Pantry
        </p>
      </section>

      {/* Hero image band */}
      <section className="relative isolate border-b-2 border-foreground">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/editorial/hero-grove.png"
            alt="An ancient terraced olive grove in Tuscany at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />
        </div>

        <div className="mx-auto w-full max-w-[100rem] px-4 py-20 sm:px-6 md:py-28 lg:px-10 lg:py-32">
          <div className="flex max-w-2xl flex-col items-start gap-7">
            <span className="bg-accent px-3 py-2 text-[0.625rem] font-bold tracking-[0.18em] text-accent-foreground uppercase">
              2025 harvest now shipping
            </span>

            <h2 className="font-display text-5xl leading-[0.9] text-balance uppercase sm:text-6xl lg:text-7xl">
              Oil that tastes like the tree
            </h2>

            <p className="max-w-lg text-base leading-relaxed text-foreground/70">
              Most supermarket oil is a blend of four countries, bottled a year
              ago, sitting under a spotlight. Ours comes from named estates in
              Tuscany, Puglia, Umbria and Sicily, pressed within hours of
              harvest, and dated so you can prove it.
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="group h-12 px-7 text-[0.6875rem] font-bold tracking-[0.14em] uppercase"
                render={<Link href="/shop" />}
              >
                Shop the collection
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-2 border-foreground bg-transparent px-7 text-[0.6875rem] font-bold tracking-[0.14em] uppercase hover:bg-accent hover:text-accent-foreground"
                render={<Link href="/journal/how-to-taste-olive-oil" />}
              >
                Learn to taste it
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker strip */}
      <section className="overflow-hidden border-b-2 border-foreground bg-accent">
        <ul className="flex items-center justify-center gap-6 px-4 py-3 sm:gap-10">
          {TICKER.map((item, index) => (
            <li
              key={item}
              className={
                "flex items-center gap-6 text-[0.625rem] font-bold tracking-[0.18em] whitespace-nowrap text-accent-foreground uppercase sm:gap-10" +
                (index > 3 ? " hidden sm:flex" : "")
              }
            >
              {item}
              <span
                aria-hidden="true"
                className="size-1.5 bg-accent-foreground/40"
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Promises */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto grid w-full max-w-[100rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((promise) => (
            <div
              key={promise.title}
              className="flex flex-col gap-3 border-border p-6 sm:border-r sm:last:border-r-0 lg:p-8"
            >
              <promise.icon
                className="size-5 text-primary"
                aria-hidden="true"
              />
              <h3 className="font-display text-sm uppercase">
                {promise.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {promise.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto w-full max-w-[100rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="The favourites"
          title="What people reorder"
          description="Four bottles that account for most of what leaves the Brooklyn shelf each week."
          action={{ href: "/shop", label: "View all" }}
        />

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {featured.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 2}
            />
          ))}
        </div>
      </section>

      {/* Editorial feature */}
      {hero ? (
        <section className="border-y-2 border-foreground bg-primary text-primary-foreground">
          <div className="mx-auto grid w-full max-w-[100rem] grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-24">
            <div className="relative aspect-square overflow-hidden border-2 border-primary-foreground/20">
              <Image
                src="/editorial/pour.png"
                alt="Green-gold olive oil being poured into a small ceramic dish"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col items-start gap-6">
              <span className="bg-accent px-3 py-2 text-[0.625rem] font-bold tracking-[0.18em] text-accent-foreground uppercase">
                {heroRegion ? `Estate oil · ${heroRegion}` : "Start here"}
              </span>
              <h2 className="font-display text-4xl leading-[0.95] text-balance uppercase sm:text-5xl lg:text-6xl">
                {hero.title}
              </h2>
              <p className="text-base leading-relaxed text-primary-foreground/75">
                {heroSummary}
              </p>

              <dl className="flex flex-wrap gap-x-12 gap-y-5 border-t border-primary-foreground/25 pt-6">
                {[
                  heroRegion ? { label: "Region", value: heroRegion } : null,
                  { label: "Harvest", value: "November 2025" },
                  {
                    label: "Price",
                    value: formatPrice(hero.priceRange.minVariantPrice),
                  },
                ]
                  .filter(
                    (item): item is { label: string; value: string } =>
                      item !== null,
                  )
                  .map((item) => (
                    <div key={item.label} className="flex flex-col gap-2">
                      <dt className="eyebrow text-accent">{item.label}</dt>
                      <dd className="font-display text-lg uppercase">
                        {item.value}
                      </dd>
                    </div>
                  ))}
              </dl>

              <Button
                size="lg"
                className="group mt-2 h-12 bg-accent px-7 text-[0.6875rem] font-bold tracking-[0.14em] text-accent-foreground uppercase hover:bg-background hover:text-foreground"
                render={<Link href={`/products/${hero.handle}`} />}
              >
                View the details
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* Olive oil grid */}
      <section className="mx-auto w-full max-w-[100rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="By region"
          title="The olive oil shelf"
          description="Six oils, four regions, one country. Start with the tasting set if you cannot choose."
          action={{
            href: "/shop?collection=olive-oil",
            label: "Shop olive oil",
          }}
        />

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {oliveOils.products
            .filter((product) => product.id !== hero?.id)
            .slice(0, 6)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      {/* Journal */}
      {articles.length > 0 ? (
        <section className="border-t-2 border-foreground bg-secondary">
          <div className="mx-auto w-full max-w-[100rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
            <SectionHeading
              eyebrow="The Journal"
              title="Learn what you taste"
              description="Short, practical writing on harvest, tasting, and how to read a label without being fooled."
              action={{ href: "/journal", label: "Read the journal" }}
            />

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
