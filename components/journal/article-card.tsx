import Image from "next/image"
import Link from "next/link"

import { formatDate } from "@/lib/format"
import type { Article } from "@/lib/shopify/types"
import { cn } from "@/lib/utils"

export function ArticleCard({
  article,
  className,
  priority = false,
}: {
  article: Article
  className?: string
  priority?: boolean
}) {
  return (
    <article className={cn("group flex flex-col gap-4", className)}>
      <Link
        href={`/journal/${article.handle}`}
        className="relative aspect-16/10 overflow-hidden border-2 border-foreground bg-secondary"
      >
        {article.image ? (
          <Image
            src={article.image.url || "/placeholder.svg"}
            alt={article.image.altText ?? article.title}
            fill
            priority={priority}
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        ) : null}
      </Link>

      <div className="flex flex-col gap-2.5">
        <div className="eyebrow flex items-center gap-2 text-muted-foreground">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          {article.authorName ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{article.authorName}</span>
            </>
          ) : null}
        </div>

        <h3 className="font-display text-xl leading-[1.1] text-pretty uppercase">
          <Link href={`/journal/${article.handle}`} className="hover:text-primary">
            {article.title}
          </Link>
        </h3>

        {article.excerpt ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
        ) : null}
      </div>
    </article>
  )
}
