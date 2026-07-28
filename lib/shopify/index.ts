import { shopifyFetch } from "./client"
import { ARTICLE_FRAGMENT, CART_FRAGMENT, PRODUCT_FRAGMENT } from "./fragments"
import type { Article, Cart, Collection, Product } from "./types"

export const BLOG_HANDLE = "journal"

/* -------------------------------------------------------------------------- */
/*                                  Mappers                                   */
/* -------------------------------------------------------------------------- */

type RawProduct = Omit<Product, "images" | "variants"> & {
  images: { nodes: Product["images"] }
  variants: { nodes: Product["variants"] }
}

function mapProduct(raw: RawProduct | null): Product | null {
  if (!raw) return null
  return {
    ...raw,
    images: raw.images?.nodes ?? [],
    variants: raw.variants?.nodes ?? [],
  }
}

type RawArticle = Omit<Article, "authorName"> & { authorV2: { name: string } | null }

function mapArticle(raw: RawArticle): Article {
  const { authorV2, ...rest } = raw
  return { ...rest, authorName: authorV2?.name ?? null }
}

type RawCart = Omit<Cart, "lines"> & { lines: { nodes: Cart["lines"] } }

function mapCart(raw: RawCart | null): Cart | null {
  if (!raw) return null
  return { ...raw, lines: raw.lines?.nodes ?? [] }
}

/* -------------------------------------------------------------------------- */
/*                                  Products                                  */
/* -------------------------------------------------------------------------- */

export async function getProducts(options?: {
  first?: number
  sortKey?: string
  reverse?: boolean
  query?: string
  collectionHandle?: string
}): Promise<Product[]> {
  // Collection-scoped listings use a different query and sort enum.
  if (options?.collectionHandle) {
    const { products } = await getCollectionProducts(options.collectionHandle, {
      first: options.first,
      // ProductCollectionSortKeys has no CREATED_AT; it uses CREATED.
      sortKey: options.sortKey === "CREATED_AT" ? "CREATED" : options.sortKey,
      reverse: options.reverse,
    })
    return products
  }

  const data = await shopifyFetch<{ products: { nodes: RawProduct[] } }>({
    query: /* GraphQL */ `
      query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
        products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
          nodes {
            ...ProductFields
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: {
      first: options?.first ?? 30,
      sortKey: options?.sortKey ?? "CREATED_AT",
      reverse: options?.reverse ?? false,
      query: options?.query ?? null,
    },
    tags: ["products"],
  })

  return data.products.nodes.map((node) => mapProduct(node)!).filter(Boolean)
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ product: RawProduct | null }>({
    query: /* GraphQL */ `
      query Product($handle: String!) {
        product(handle: $handle) {
          ...ProductFields
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: { handle },
    tags: ["products", `product-${handle}`],
  })

  return mapProduct(data.product)
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const data = await shopifyFetch<{ productRecommendations: RawProduct[] | null }>({
    query: /* GraphQL */ `
      query Recommendations($productId: ID!) {
        productRecommendations(productId: $productId) {
          ...ProductFields
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: { productId },
    tags: ["products"],
  })

  return (data.productRecommendations ?? []).map((node) => mapProduct(node)!).filter(Boolean)
}

/* -------------------------------------------------------------------------- */
/*                                Collections                                 */
/* -------------------------------------------------------------------------- */

export async function getCollections(): Promise<Collection[]> {
  const data = await shopifyFetch<{ collections: { nodes: Collection[] } }>({
    query: /* GraphQL */ `
      query Collections {
        collections(first: 20) {
          nodes {
            id
            handle
            title
            description
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    `,
    tags: ["collections"],
  })

  return data.collections.nodes.filter((c) => c.handle !== "frontpage")
}

export async function getCollectionProducts(
  handle: string,
  options?: { first?: number; sortKey?: string; reverse?: boolean },
): Promise<{
  collection: Collection | null
  products: Product[]
}> {
  const data = await shopifyFetch<{
    collection:
      | (Collection & {
          products: { nodes: RawProduct[] }
        })
      | null
  }>({
    query: /* GraphQL */ `
      query CollectionProducts(
        $handle: String!
        $first: Int!
        $sortKey: ProductCollectionSortKeys
        $reverse: Boolean
      ) {
        collection(handle: $handle) {
          id
          handle
          title
          description
          image {
            url
            altText
            width
            height
          }
          products(first: $first, sortKey: $sortKey, reverse: $reverse) {
            nodes {
              ...ProductFields
            }
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: {
      handle,
      first: options?.first ?? 40,
      sortKey: options?.sortKey ?? "COLLECTION_DEFAULT",
      reverse: options?.reverse ?? false,
    },
    tags: ["collections", "products"],
  })

  if (!data.collection) return { collection: null, products: [] }

  const { products, ...collection } = data.collection

  return {
    collection,
    products: products.nodes.map((node) => mapProduct(node)!).filter(Boolean),
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Articles                                  */
/* -------------------------------------------------------------------------- */

export async function getArticles(first = 12): Promise<Article[]> {
  const data = await shopifyFetch<{
    blog: { articles: { nodes: RawArticle[] } } | null
  }>({
    query: /* GraphQL */ `
      query Articles($handle: String!, $first: Int!) {
        blog(handle: $handle) {
          articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
            nodes {
              ...ArticleFields
            }
          }
        }
      }
      ${ARTICLE_FRAGMENT}
    `,
    variables: { handle: BLOG_HANDLE, first },
    tags: ["articles"],
  })

  return (data.blog?.articles.nodes ?? []).map(mapArticle)
}

export async function getArticle(handle: string): Promise<Article | null> {
  const data = await shopifyFetch<{
    blog: { articleByHandle: RawArticle | null } | null
  }>({
    query: /* GraphQL */ `
      query ArticleByHandle($blogHandle: String!, $handle: String!) {
        blog(handle: $blogHandle) {
          articleByHandle(handle: $handle) {
            ...ArticleFields
          }
        }
      }
      ${ARTICLE_FRAGMENT}
    `,
    variables: { blogHandle: BLOG_HANDLE, handle },
    tags: ["articles", `article-${handle}`],
  })

  const article = data.blog?.articleByHandle
  return article ? mapArticle(article) : null
}

/* -------------------------------------------------------------------------- */
/*                                    Cart                                    */
/* -------------------------------------------------------------------------- */

export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = [],
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: RawCart | null; userErrors: Array<{ message: string }> }
  }>({
    query: /* GraphQL */ `
      mutation CartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: { lines },
    revalidate: 0,
  })

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join("; "))
  }

  const cart = mapCart(data.cartCreate.cart)
  if (!cart) throw new Error("Unable to create cart.")
  return cart
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: RawCart | null }>({
    query: /* GraphQL */ `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          ...CartFields
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId },
    revalidate: 0,
  })

  return mapCart(data.cart)
}

export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: RawCart | null; userErrors: Array<{ message: string }> }
  }>({
    query: /* GraphQL */ `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId, lines },
    revalidate: 0,
  })

  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join("; "))
  }

  const cart = mapCart(data.cartLinesAdd.cart)
  if (!cart) throw new Error("Unable to add to cart.")
  return cart
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: RawCart | null; userErrors: Array<{ message: string }> }
  }>({
    query: /* GraphQL */ `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId, lines },
    revalidate: 0,
  })

  if (data.cartLinesUpdate.userErrors.length) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join("; "))
  }

  const cart = mapCart(data.cartLinesUpdate.cart)
  if (!cart) throw new Error("Unable to update cart.")
  return cart
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: RawCart | null; userErrors: Array<{ message: string }> }
  }>({
    query: /* GraphQL */ `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    variables: { cartId, lineIds },
    revalidate: 0,
  })

  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join("; "))
  }

  const cart = mapCart(data.cartLinesRemove.cart)
  if (!cart) throw new Error("Unable to remove from cart.")
  return cart
}
