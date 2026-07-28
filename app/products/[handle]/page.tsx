import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProduct, getProductRecommendations } from "@/lib/shopify"
import { ProductGallery } from "@/components/product/product-gallery"
import { AddToCartForm } from "@/components/product/add-to-cart-form"
import { ProductPrice } from "@/components/product/product-price"
import { ProductCard } from "@/components/product/product-card"
import { SectionHeading } from "@/components/layout/section-heading"
import { Badge } from "@/components/ui/badge"

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await props.params
  const product = await getProduct(handle)
  if (!product) return { title: "Product not found" }

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description.slice(0, 155),
    openGraph: product.featuredImage
      ? { images: [{ url: product.featuredImage.url, alt: product.title }] }
      : undefined,
  }
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const { handle } = await props.params
  const product = await getProduct(handle)

  if (!product) notFound()

  const recommendations = (await getProductRecommendations(product.id)).slice(0, 3)

  const hasRange =
    product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount

  return (
    <div className="pb-20 sm:pb-28">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">
        <ol className="flex flex-wrap items-center gap-2 eyebrow text-muted-foreground">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="transition-colors hover:text-foreground">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground">{product.title}</li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-14">
        <ProductGallery images={product.images} title={product.title} />

        <div className="flex flex-col">
          {product.productType && (
            <p className="eyebrow text-primary">
              {product.productType}
            </p>
          )}

          <h1 className="mt-4 font-display text-3xl leading-[1.0] uppercase text-balance sm:text-4xl md:text-[2.75rem]">
            {product.title}
          </h1>

          {product.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <ProductPrice
            className="mt-8"
            price={product.priceRange.minVariantPrice}
            compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
            hasRange={hasRange}
          />

          <div className="mt-6">
            <AddToCartForm product={product} />
          </div>

          <div
            className="prose-pantry mt-10 border-t border-border pt-8"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      </div>

      {recommendations.length > 0 && (
        <section className="mx-auto max-w-6xl border-t border-border px-5 pt-14 sm:px-8 sm:pt-20">
          <SectionHeading eyebrow="You may also like" title="From the same cellar" />
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
