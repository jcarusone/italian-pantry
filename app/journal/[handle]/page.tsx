import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getArticle, getArticles } from "@/lib/shopify"
import { ArticleCard } from "@/components/journal/article-card"
import { SectionHeading } from "@/components/layout/section-heading"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await props.params
  const article = await getArticle(handle)
  if (!article) return { title: "Article not found" }

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      type: "article",
      publishedTime: article.publishedAt,
      images: article.image ? [{ url: article.image.url, alt: article.title }] : undefined,
    },
  }
}

export default async function ArticlePage(props: { params: Promise<{ handle: string }> }) {
  const { handle } = await props.params
  const article = await getArticle(handle)

  if (!article) notFound()

  const more = (await getArticles(6)).filter((a) => a.handle !== handle).slice(0, 3)

  return (
    <article className="pb-20 sm:pb-28">
      <div className="mx-auto max-w-3xl px-5 pt-10 sm:px-8 sm:pt-16">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 eyebrow text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          The Journal
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 eyebrow text-muted-foreground">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            {article.authorName ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{article.authorName}</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-5 font-display text-4xl leading-[0.95] uppercase text-balance sm:text-5xl">
            {article.title}
          </h1>

          {article.excerpt ? (
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              {article.excerpt}
            </p>
          ) : null}

          {article.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>
      </div>

      {article.image ? (
        <div className="mx-auto mt-10 max-w-5xl px-5 sm:px-8">
          <div className="relative aspect-16/9 overflow-hidden rounded-sm bg-secondary">
            <Image
              src={article.image.url || "/placeholder.svg"}
              alt={article.image.altText ?? article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <div
        className="prose-pantry mx-auto mt-12 max-w-2xl px-5 sm:px-8"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />

      {more.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl border-t border-border px-5 pt-14 sm:px-8 sm:pt-20">
          <SectionHeading eyebrow="Keep reading" title="More from the journal" />
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
