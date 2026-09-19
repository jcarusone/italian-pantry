import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getArticles } from "@/lib/shopify"
import { ArticleCard } from "@/components/journal/article-card"
import { formatDate } from "@/lib/format"

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Notes from the groves and the mill: how olive oil is made, how to taste it, and how to read a label without being fooled.",
}

export default async function JournalPage() {
  const articles = await getArticles(24)
  const [lead, ...rest] = articles

  return (
    <div className="pb-20 sm:pb-28">
      <header className="border-b border-border bg-card">
        <div className="site-container py-14 sm:py-20">
          <p className="eyebrow text-muted-foreground">
            Stories
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[0.95] uppercase text-balance sm:text-5xl md:text-6xl">
            Notes from the groves
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground text-pretty">
            How the oil is actually made, how to taste it properly, and how to read a label without
            being fooled.
          </p>
        </div>
      </header>

      {articles.length === 0 ? (
        <p className="py-24 text-center text-muted-foreground">
          No articles published yet. Please check back soon.
        </p>
      ) : (
        <div className="site-container">
          {/* Lead article */}
          <Link
            href={`/journal/${lead.handle}`}
            className="group grid grid-cols-1 items-center gap-8 border-b border-border py-14 lg:grid-cols-2 lg:gap-14"
          >
            <div className="relative aspect-4/3 overflow-hidden rounded-sm bg-secondary">
              {lead.image ? (
                <Image
                  src={lead.image.url || "/placeholder.svg"}
                  alt={lead.image.altText ?? lead.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>

            <div>
              <p className="eyebrow text-primary">
                Latest · {formatDate(lead.publishedAt)}
              </p>
              <h2 className="mt-4 font-display text-3xl leading-[1.0] uppercase text-balance transition-colors group-hover:text-primary sm:text-4xl">
                {lead.title}
              </h2>
              {lead.excerpt ? (
                <p className="mt-5 leading-relaxed text-muted-foreground text-pretty">
                  {lead.excerpt}
                </p>
              ) : null}
              <span className="mt-6 inline-block text-sm text-foreground underline decoration-primary decoration-2 underline-offset-4">
                Read the article
              </span>
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 py-14 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
