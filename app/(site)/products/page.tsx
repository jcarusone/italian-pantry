import type { Metadata } from "next"

import {
  parseSortValue,
  ProductsListing,
} from "@/components/product/products-listing"

export const metadata: Metadata = {
  title: "Shop the collection",
  description:
    "Extra virgin olive oil, tomatoes, pâtés and antipasto from small-batch producers and family farms in Italy. Simple ingredients, shipped across Canada.",
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
