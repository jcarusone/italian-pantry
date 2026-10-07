import { SectionHeading } from "@/components/layout/section-heading";
import { StoryCard } from "@/components/stories/story-card";
import type { PublicStory } from "@/lib/cms/content";

export function LatestStories({ heading, stories }: { heading: string; stories: PublicStory[] }) {
  if (stories.length === 0) return null;
  return (
    <section className="py-24 md:py-36">
      <div className="site-container">
        <SectionHeading title={heading} action={{ href: "/stories", label: "All stories" }} />
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
