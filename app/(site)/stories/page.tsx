import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { StoryCard } from "@/components/stories/story-card";
import { getContent, getPublishedStories } from "@/lib/cms/content";
import { toLines } from "@/lib/cms/text";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContent("stories.page");
  return { title: page.heading, description: page.intro };
}

export default async function StoriesPage() {
  const [page, stories] = await Promise.all([getContent("stories.page"), getPublishedStories()]);
  const [lead, ...rest] = stories;

  return (
    <div className="pb-24 md:pb-36">
      <PageHeader lines={toLines(page.heading)} intro={page.intro} />

      <div className="site-container">
        {!lead ? (
          <p className="border-t border-frantoio/15 py-20 text-muted-foreground">{page.emptyMessage}</p>
        ) : (
          <>
            <StoryCard
              story={lead}
              priority
              className="border-t border-frantoio/15 pt-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 [&_h3]:lg:text-[2.75rem]"
            />
            {rest.length ? (
              <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-14 border-t border-frantoio/15 pt-14 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
