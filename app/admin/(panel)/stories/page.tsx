import { asc, desc } from "drizzle-orm";

import { StoriesList } from "@/components/admin/stories-list";
import { Button, PageTitle } from "@/components/admin/ui";
import { createStory } from "@/lib/admin/actions";
import { getDb, schema } from "@/lib/db";

export const metadata = { title: "Stories" };

export default async function StoriesAdmin() {
  const rows = await getDb()
    .select()
    .from(schema.stories)
    .orderBy(asc(schema.stories.position), desc(schema.stories.publishedAt));

  return (
    <>
      <PageTitle
        title="Stories"
        description="Write and publish stories. Drag them to set the order they appear in on the Stories page; the first three can also be shown on the homepage."
        actions={
          <form action={createStory}>
            <Button type="submit" variant="primary">
              New story
            </Button>
          </form>
        }
      />
      <StoriesList
        initial={rows.map((r) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          status: r.status,
          publishedAt: r.publishedAt?.toISOString() ?? null,
          updatedAt: r.updatedAt.toISOString(),
          coverUrl: r.coverUrl,
        }))}
      />
    </>
  );
}
