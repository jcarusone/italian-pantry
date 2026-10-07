import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MaskLines } from "@/components/motion/reveal";
import { formatStoryDate, StoryCard } from "@/components/stories/story-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { getPublishedStories, getStoryBySlug } from "@/lib/cms/content";
import { sanitizeStoryHtml } from "@/lib/cms/sanitize";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = await getStoryBySlug((await params).slug);
  if (!story) return { title: "Story not found" };
  return {
    title: story.seoTitle || story.title,
    description: story.seoDescription || story.excerpt || undefined,
    openGraph: {
      type: "article",
      publishedTime: story.publishedAt ?? undefined,
      images: story.coverUrl ? [{ url: story.coverUrl, alt: story.coverAlt || story.title }] : undefined,
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();

  const more = (await getPublishedStories()).filter((s) => s.id !== story.id).slice(0, 3);
  const date = formatStoryDate(story.publishedAt);

  return (
    <article className="pb-24 md:pb-36">
      <div className="site-container pt-10 md:pt-16">
        <div className="max-w-4xl">
          <Link href="/stories" className="text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground">
            ← All stories
          </Link>
          <MaskLines
            as="h1"
            immediate
            lines={[story.title]}
            className="mt-8 font-display text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.04] text-balance"
          />
          {story.excerpt ? (
            <p className="mt-6 max-w-[40rem] text-[1.1875rem] leading-relaxed text-muted-foreground text-pretty">
              {story.excerpt}
            </p>
          ) : null}
          {date || story.author ? (
            <p className="mt-6 text-[0.9375rem] text-muted-foreground">
              {date ? <time dateTime={story.publishedAt ?? undefined}>{date}</time> : null}
              {story.author ? <>{date ? " by " : "By "}{story.author}</> : null}
            </p>
          ) : null}
        </div>
      </div>

      {story.coverUrl ? (
        <div className="site-container mt-12">
          <div className="relative aspect-16/9 overflow-hidden rounded-lg bg-secondary">
            <Image
              src={story.coverUrl}
              alt={story.coverAlt || story.title}
              fill
              priority
              sizes="(max-width: 1440px) 100vw, 1360px"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="site-container mt-14">
        <div
          className="prose-pantry mx-auto max-w-[42rem]"
          dangerouslySetInnerHTML={{ __html: sanitizeStoryHtml(story.body) }}
        />
      </div>

      {more.length ? (
        <section className="site-container mt-28 border-t border-frantoio/15 pt-16 md:mt-36 md:pt-24">
          <SectionHeading title="Keep reading" action={{ href: "/stories", label: "All stories" }} />
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((item) => (
              <StoryCard key={item.id} story={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
