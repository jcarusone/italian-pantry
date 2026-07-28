export type Money = {
  amount: string
  currencyCode: string
}

export type ShopifyImage = {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

export type SelectedOption = {
  name: string
  value: string
}

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  sku: string | null
  price: Money
  compareAtPrice: Money | null
  selectedOptions: SelectedOption[]
  image: ShopifyImage | null
}

export type ProductOption = {
  id: string
  name: string
  values: string[]
}

export type Product = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  productType: string
  vendor: string
  tags: string[]
  availableForSale: boolean
  featuredImage: ShopifyImage | null
  images: ShopifyImage[]
  options: ProductOption[]
  variants: ProductVariant[]
  priceRange: {
    minVariantPrice: Money
    maxVariantPrice: Money
  }
  compareAtPriceRange: {
    minVariantPrice: Money
  } | null
  seo: {
    title: string | null
    description: string | null
  }
}

export type Collection = {
  id: string
  handle: string
  title: string
  description: string
  image: ShopifyImage | null
}

export type Article = {
  id: string
  handle: string
  title: string
  excerpt: string | null
  contentHtml: string
  publishedAt: string
  tags: string[]
  image: ShopifyImage | null
  authorName: string | null
}

export type CartLine = {
  id: string
  quantity: number
  cost: {
    totalAmount: Money
    subtotalAmount: Money
  }
  merchandise: {
    id: string
    title: string
    selectedOptions: SelectedOption[]
    image: ShopifyImage | null
    price: Money
    product: {
      handle: string
      title: string
      featuredImage: ShopifyImage | null
    }
  }
}

export type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: Money
    totalAmount: Money
    totalTaxAmount: Money | null
  }
  lines: CartLine[]
}
