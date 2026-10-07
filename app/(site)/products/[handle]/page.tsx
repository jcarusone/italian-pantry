import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/layout/section-heading";
import { AddToCartForm } from "@/components/product/add-to-cart-form";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPrice } from "@/components/product/product-price";
import { parseSortValue, ProductsListing } from "@/components/product/products-listing";
import { MaskLines } from "@/components/motion/reveal";
import { getCollections, getProduct, getProductRecommendations } from "@/lib/shopify";
import { getContent } from "@/lib/cms/content";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await props.params;
  const collections = await getCollections();
  const collection = collections.find((item) => item.handle === handle);

  if (collection) {
    return { title: collection.title, description: collection.description || undefined };
  }

  const product = await getProduct(handle);
  if (!product) return { title: "Not found" };

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description.slice(0, 155),
    openGraph: product.featuredImage
      ? { images: [{ url: product.featuredImage.url, alt: product.title }] }
      : undefined,
  };
}

export default async function ProductOrCollectionPage(props: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { handle } = await props.params;
  const searchParams = await props.searchParams;
  const collections = await getCollections();
  const collection = collections.find((item) => item.handle === handle);

  if (collection) {
    return (
      <ProductsListing
        activeCollection={handle}
        activeSort={parseSortValue(searchParams.sort)}
        collections={collections}
      />
    );
  }

  const product = await getProduct(handle);
  if (!product) notFound();

  const [recommendations, shop] = await Promise.all([
    getProductRecommendations(product.id).then((list) => list.slice(0, 4)),
    getContent("shop.page"),
  ]);
  const hasRange =
    product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;

  return (
    <div className="pb-24 md:pb-36">
      <nav aria-label="Breadcrumb" className="site-container pt-8">
        <ol className="flex flex-wrap items-center gap-2 text-[0.875rem] text-muted-foreground">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/products" className="transition-colors hover:text-foreground">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground" aria-current="page">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="site-container grid grid-cols-1 gap-12 pt-8 lg:grid-cols-12 lg:gap-10 lg:pt-12">
        <div className="lg:col-span-5">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        <div className="flex flex-col lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-7">
          {product.productType ? (
            <p className="label text-gold">{product.productType}</p>
          ) : null}

          <MaskLines
            as="h1"
            immediate
            lines={[product.title]}
            className="mt-3 font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1.06] text-balance"
          />

          <ProductPrice
            className="mt-6"
            price={product.priceRange.minVariantPrice}
            compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
            hasRange={hasRange}
          />

          <div className="mt-8">
            <AddToCartForm product={product} />
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-5 border-y border-frantoio/15 py-6 sm:grid-cols-3">
            {shop.promises.map((promise, index) => (
              <div key={`${promise.title}-${index}`}>
                <dt className="text-[0.9375rem] font-semibold">{promise.title}</dt>
                <dd className="mt-1 text-[0.875rem] leading-snug text-muted-foreground">
                  {promise.body}
                </dd>
              </div>
            ))}
          </dl>

          <div
            className="prose-pantry mt-10"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      </div>

      {recommendations.length > 0 ? (
        <section className="site-container mt-28 md:mt-36">
          <SectionHeading
            title="You may also like"
            action={{ href: "/products", label: "Shop everything" }}
          />
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
            {recommendations.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
