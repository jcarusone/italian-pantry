import Image from "next/image";
import Link from "next/link";

import type { PublicStory } from "@/lib/cms/content";
import { cn } from "@/lib/utils";

export function formatStoryDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-CA", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

export function StoryCard({ story, className, priority = false }: { story: PublicStory; className?: string; priority?: boolean }) {
  const date = formatStoryDate(story.publishedAt);
  return (
    <article className={cn("group relative flex flex-col gap-4", className)}>
      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-secondary">
        {story.coverUrl ? (
          <Image
            src={story.coverUrl}
            alt={story.coverAlt || story.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-(--ease-pour) group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        {date ? (
          <p className="text-[0.875rem] text-muted-foreground">
            <time dateTime={story.publishedAt ?? undefined}>{date}</time>
            {story.author ? <> by {story.author}</> : null}
          </p>
        ) : null}
        <h3 className="font-display text-[1.625rem] leading-[1.12] text-pretty">
          <Link href={`/stories/${story.slug}`} className="after:absolute after:inset-0 hover:text-leaf">
            {story.title}
          </Link>
        </h3>
        {story.excerpt ? (
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{story.excerpt}</p>
        ) : null}
      </div>
    </article>
  );
}
