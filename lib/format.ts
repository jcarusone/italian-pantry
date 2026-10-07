import type { Money } from "@/lib/shopify/types"

export function formatPrice(money: Money | null | undefined) {
  if (!money) return ""

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: money.currencyCode || "CAD",
    minimumFractionDigits: 2,
  }).format(Number.parseFloat(money.amount))
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value))
}

/**
 * Shopify storefronts on a password-protected/dev store show a "Password
 * Required" screen unless the online_store channel is specified.
 */
export function buildCheckoutUrl(checkoutUrl: string) {
  try {
    const url = new URL(checkoutUrl)
    url.searchParams.set("channel", "online_store")
    return url.toString()
  } catch {
    return checkoutUrl
  }
}
