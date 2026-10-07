/**
 * Preview catalogue.
 *
 * Used ONLY when SHOPIFY_DEMO_MODE=true, so the design can be previewed before the
 * Storefront API keys are connected. Live data always comes from Shopify. Names, sizes,
 * prices and descriptions follow the content brief; replace them in Shopify, not here.
 */
import type { Collection, Product, ProductVariant } from "./types"

export function isDemoMode() {
  return process.env.SHOPIFY_DEMO_MODE === "true"
}

const CAD = (amount: number) => ({ amount: amount.toFixed(2), currencyCode: "CAD" })

type DemoInput = {
  handle: string
  title: string
  productType: string
  tags: string[]
  image: string
  alt: string
  description: string
  variants: Array<{ title: string; price: number }>
  extraImages?: string[]
}

function build(input: DemoInput, index: number): Product {
  const image = { url: input.image, altText: input.alt, width: 800, height: 1000 }
  const extra = (input.extraImages ?? []).map((url) => ({ url, altText: input.alt, width: 1000, height: 1000 }))
  const variants: ProductVariant[] = input.variants.map((variant, i) => ({
    id: `demo-variant-${index}-${i}`,
    title: variant.title,
    availableForSale: true,
    sku: null,
    price: CAD(variant.price),
    compareAtPrice: null,
    selectedOptions: [{ name: "Size", value: variant.title }],
    image,
  }))
  const prices = input.variants.map((v) => v.price)

  return {
    id: `demo-product-${index}`,
    handle: input.handle,
    title: input.title,
    description: input.description,
    descriptionHtml: `<p>${input.description}</p>`,
    productType: input.productType,
    vendor: "Italian Pantry",
    tags: input.tags,
    availableForSale: true,
    featuredImage: image,
    images: [image, ...extra],
    options: [{ id: `demo-option-${index}`, name: "Size", values: input.variants.map((v) => v.title) }],
    variants,
    priceRange: {
      minVariantPrice: CAD(Math.min(...prices)),
      maxVariantPrice: CAD(Math.max(...prices)),
    },
    compareAtPriceRange: null,
    seo: { title: null, description: null },
  }
}

const INPUT: DemoInput[] = [
  {
    handle: "frantoio-arrizza-extra-virgin-olive-oil",
    title: "Frantoio Arrizza Extra Virgin Olive Oil",
    productType: "Olive oil",
    tags: ["Abruzzo"],
    image: "/demo/evoo.webp",
    extraImages: ["/brand/flagship-bottle.webp", "/editorial/pour.png", "/product-line/img-17.webp"],
    alt: "A bottle of Frantoio Arrizza extra virgin olive oil",
    description:
      "Cold-extracted using a centrifuge mill from olives grown exclusively in Abruzzo. Not blended, not diluted, not processed. Pure oil from crushed Italian olives, as it has always been made.",
    variants: [
      { title: "500 ml", price: 32.99 },
      { title: "1 L", price: 58.99 },
    ],
  },
  {
    handle: "whole-peeled-tomatoes",
    title: "Whole Peeled Tomatoes",
    productType: "Tomatoes",
    tags: ["Campania"],
    image: "/demo/pelati.webp",
    alt: "A jar of whole peeled Italian tomatoes",
    description:
      "Sun-ripened plum tomatoes from a family farm, peeled and packed in their own juice. No citric acid. No calcium chloride. Just tomatoes.",
    variants: [{ title: "400 g", price: 6.99 }],
  },
  {
    handle: "tomato-passata",
    title: "Tomato Passata",
    productType: "Tomatoes",
    tags: ["Campania"],
    image: "/demo/passata.webp",
    alt: "A bottle of Italian tomato passata",
    description:
      "Strained Italian plum tomatoes with nothing added. Smooth, vibrant and intensely flavoured, the base every good sauce deserves.",
    variants: [{ title: "700 g", price: 7.49 }],
  },
  {
    handle: "olive-pate",
    title: "Olive Pâté",
    productType: "Spreads & antipasto",
    tags: ["Abruzzo"],
    image: "/demo/olive-pate.webp",
    alt: "A jar of black olive pâté",
    description:
      "A velvety spread made from stone-crushed Italian olives, a touch of extra virgin olive oil, and nothing else. Pure olive intensity.",
    variants: [{ title: "190 g", price: 10.49 }],
  },
  {
    handle: "bruschetta-al-pomodoro",
    title: "Bruschetta al Pomodoro",
    productType: "Spreads & antipasto",
    tags: ["Abruzzo"],
    image: "/demo/bruschetta.webp",
    alt: "A jar of tomato bruschetta topping",
    description:
      "Coarsely chopped Italian tomatoes seasoned with extra virgin olive oil, basil and sea salt. Ready to spread.",
    variants: [{ title: "190 g", price: 9.49 }],
  },
  {
    handle: "grilled-vegetable-antipasto",
    title: "Grilled Vegetable Antipasto",
    productType: "Spreads & antipasto",
    tags: ["Abruzzo"],
    image: "/demo/antipasto.webp",
    alt: "Grilled vegetables and antipasto on a board",
    description:
      "Grilled zucchini, eggplant and peppers in extra virgin olive oil, Italian summer vegetables at their best.",
    variants: [{ title: "280 g", price: 11.99 }],
  },
  {
    handle: "eggplant-caponata",
    title: "Eggplant Caponata",
    productType: "Spreads & antipasto",
    tags: ["Abruzzo"],
    image: "/demo/caponata.webp",
    alt: "Eggplant caponata served with bread",
    description:
      "Sweet and savoury eggplant preserved in olive oil with capers and a hint of tomato. A true Italian staple.",
    variants: [{ title: "190 g", price: 10.99 }],
  },
]

export const DEMO_PRODUCTS: Product[] = INPUT.map(build)

export const DEMO_COLLECTIONS: Collection[] = [
  {
    id: "demo-collection-oil",
    handle: "olive-oil",
    title: "Olive oil",
    description: "Extra virgin olive oil from Abruzzo.",
    image: null,
  },
  {
    id: "demo-collection-tomatoes",
    handle: "tomatoes",
    title: "Tomatoes",
    description: "Whole peeled tomatoes and passata.",
    image: null,
  },
  {
    id: "demo-collection-spreads",
    handle: "spreads-antipasto",
    title: "Spreads & antipasto",
    description: "Pâtés, bruschetta and preserved vegetables.",
    image: null,
  },
]

const COLLECTION_TYPES: Record<string, string> = {
  "olive-oil": "Olive oil",
  tomatoes: "Tomatoes",
  "spreads-antipasto": "Spreads & antipasto",
}

export function demoCollectionProducts(handle: string) {
  const collection = DEMO_COLLECTIONS.find((c) => c.handle === handle) ?? null
  const type = COLLECTION_TYPES[handle]
  return {
    collection,
    products: collection ? DEMO_PRODUCTS.filter((p) => p.productType === type) : [],
  }
}

export function demoSort(products: Product[], sortKey?: string, reverse?: boolean) {
  const list = [...products]
  if (sortKey === "PRICE") {
    list.sort(
      (a, b) =>
        Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount),
    )
  }
  return reverse ? list.reverse() : list
}
