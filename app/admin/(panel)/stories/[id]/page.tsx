import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { StoryEditor } from "@/components/admin/story-editor";
import { getDb, schema } from "@/lib/db";

export const metadata = { title: "Edit story" };

export default async function EditStory({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [story] = await getDb().select().from(schema.stories).where(eq(schema.stories.id, id)).limit(1);
  if (!story) notFound();

  return (
    <StoryEditor
      key={story.id}
      story={{
        id: story.id,
        title: story.title,
        slug: story.slug,
        excerpt: story.excerpt,
        body: story.body,
        coverUrl: story.coverUrl,
        coverAlt: story.coverAlt,
        author: story.author,
        status: story.status,
        publishedAt: story.publishedAt?.toISOString() ?? null,
        seoTitle: story.seoTitle,
        seoDescription: story.seoDescription,
      }}
    />
  );
}
