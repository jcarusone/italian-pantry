import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="site-container flex flex-col items-center py-28 text-center sm:py-36">
      <div className="max-w-lg">
      <p className="eyebrow text-muted-foreground">
        404
      </p>
      <h1 className="mt-5 font-display text-4xl leading-[1.0] uppercase text-balance sm:text-5xl">
        This shelf is empty
      </h1>
      <p className="mt-5 leading-relaxed text-muted-foreground text-pretty">
        The page you were looking for has moved or never existed. The cellar, however, is fully
        stocked.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" render={<Link href="/products" />} className="px-7">
          Browse the cellar
        </Button>
        <Button
          size="lg"
          variant="outline"
          render={<Link href="/" />}
          className="px-7"
        >
          Back home
        </Button>
      </div>
      </div>
    </div>
  )
}
