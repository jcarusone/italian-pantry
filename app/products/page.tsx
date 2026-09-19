import type { Metadata } from "next"

import {
  parseSortValue,
  ProductsListing,
} from "@/components/product/products-listing"

export const metadata: Metadata = {
  title: "Products",
  description:
    "Single-origin Italian extra virgin olive oils, aged balsamic vinegar, and bronze-cut pasta, imported direct from the producer.",
}

export default async function ProductsPage(props: {
  searchParams: Promise<{ sort?: string }>
}) {
  const searchParams = await props.searchParams

  return (
    <ProductsListing
      activeCollection="all"
      activeSort={parseSortValue(searchParams.sort)}
    />
  )
}
