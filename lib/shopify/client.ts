const API_VERSION = "2025-04"

type ShopifyFetchOptions = {
  query: string
  variables?: Record<string, unknown>
  /** Seconds to cache. Pass 0 to opt out of caching (cart/mutations). */
  revalidate?: number
  tags?: string[]
}

type GraphQLResponse<T> = {
  data?: T
  errors?: Array<{ message: string }>
}

function getConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!domain || !token) {
    throw new Error(
      "Missing Shopify configuration. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
    )
  }

  const host = domain.replace(/^https?:\/\//, "").replace(/\/$/, "")

  return { endpoint: `https://${host}/api/${API_VERSION}/graphql.json`, token }
}

export async function shopifyFetch<T>({
  query,
  variables,
  revalidate = 300,
  tags,
}: ShopifyFetchOptions): Promise<T> {
  const { endpoint, token } = getConfig()

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    ...(revalidate === 0
      ? { cache: "no-store" as RequestCache }
      : { next: { revalidate, tags } }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Shopify request failed (${response.status}): ${body.slice(0, 300)}`)
  }

  const json = (await response.json()) as GraphQLResponse<T>

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`)
  }

  if (!json.data) {
    throw new Error("Shopify returned an empty response.")
  }

  return json.data
}
