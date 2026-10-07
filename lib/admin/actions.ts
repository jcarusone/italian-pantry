"use server";

import { desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { sectionSchema } from "@/lib/cms/fields";
import { DEFAULTS, HOME_SECTION_LABELS, getSectionDef } from "@/lib/cms/sections";
import { getDb, schema } from "@/lib/db";
import { removeFile } from "@/lib/storage";

import { refreshSite } from "./revalidate";

export type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

function failure(error: unknown, fallback: string): { ok: false; error: string } {
  if (error instanceof z.ZodError) {
    const issue = error.issues[0];
    return { ok: false, error: `${issue.path.join(" › ") || "Value"}: ${issue.message}` };
  }
  console.error(fallback, error);
  return { ok: false, error: error instanceof Error ? error.message : fallback };
}

/* -------------------------------------------------------------------------- */
/*                                  Content                                   */
/* -------------------------------------------------------------------------- */

export async function saveSection(key: string, values: unknown): Promise<Result> {
  const user = await requireAdmin();
  const def = getSectionDef(key);
  if (!def) return { ok: false, error: "Unknown section." };
  try {
    const data = sectionSchema(def).parse(values);
    await getDb()
      .insert(schema.contentBlocks)
      .values({ key, data, updatedBy: user.email })
      .onConflictDoUpdate({
        target: schema.contentBlocks.key,
        set: { data, updatedBy: user.email, updatedAt: new Date() },
      });
    refreshSite();
    return { ok: true };
  } catch (error) {
    return failure(error, "Could not save this section.");
  }
}

/** Put a section back to the original copy. */
export async function resetSection(key: string): Promise<Result<unknown>> {
  await requireAdmin();
  if (!(key in DEFAULTS)) return { ok: false, error: "Unknown section." };
  try {
    await getDb().delete(schema.contentBlocks).where(eq(schema.contentBlocks.key, key));
    refreshSite();
    return { ok: true, data: DEFAULTS[key as keyof typeof DEFAULTS] };
  } catch (error) {
    return failure(error, "Could not reset this section.");
  }
}

const homeLayoutSchema = z.array(
  z.object({ id: z.enum(Object.keys(HOME_SECTION_LABELS) as [string, ...string[]]), visible: z.boolean() }),
);

export async function saveHomeLayout(sections: unknown): Promise<Result> {
  const user = await requireAdmin();
  try {
    const parsed = homeLayoutSchema.parse(sections);
    const data = { sections: parsed };
    await getDb()
      .insert(schema.contentBlocks)
      .values({ key: "home.layout", data, updatedBy: user.email })
      .onConflictDoUpdate({
        target: schema.contentBlocks.key,
        set: { data, updatedBy: user.email, updatedAt: new Date() },
      });
    refreshSite();
    return { ok: true };
  } catch (error) {
    return failure(error, "Could not save the homepage layout.");
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Navigation                                 */
/* -------------------------------------------------------------------------- */

const linkSchema = z.object({
  label: z.string().trim().min(1, "Every link needs a label").max(80),
  href: z
    .string()
    .trim()
    .min(1, "Every link needs an address")
    .max(2000)
    .refine((v) => /^(\/|#|https?:\/\/|mailto:|tel:)/.test(v), "Addresses start with /, https://, mailto: or tel:"),
  newTab: z.boolean(),
});

const navigationSchema = z.object({
  header: z.array(linkSchema).max(12),
  footer: z
    .array(
      z.object({
        title: z.string().trim().min(1, "Every footer column needs a title").max(60),
        includeCollections: z.boolean(),
        items: z.array(linkSchema).max(30),
      }),
    )
    .max(6),
});

export async function saveNavigation(navigation: unknown): Promise<Result> {
  await requireAdmin();
  try {
    const nav = navigationSchema.parse(navigation);
    await getDb().transaction(async (tx) => {
      await tx.delete(schema.menus);
      const [header] = await tx
        .insert(schema.menus)
        .values({ title: "Header", location: "header", position: 0 })
        .returning();
      if (nav.header.length) {
        await tx
          .insert(schema.menuItems)
          .values(nav.header.map((item, position) => ({ ...item, menuId: header.id, position })));
      }
      for (const [position, column] of nav.footer.entries()) {
        const [menu] = await tx
          .insert(schema.menus)
          .values({ title: column.title, location: "footer", position, includeCollections: column.includeCollections })
          .returning();
        if (column.items.length) {
          await tx
            .insert(schema.menuItems)
            .values(column.items.map((item, i) => ({ ...item, menuId: menu.id, position: i })));
        }
      }
    });
    refreshSite();
    return { ok: true };
  } catch (error) {
    return failure(error, "Could not save the menus.");
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Stories                                   */
/* -------------------------------------------------------------------------- */

export async function createStory() {
  const user = await requireAdmin();
  const db = getDb();
  const [{ min }] = await db
    .select({ min: sql<number>`coalesce(min(${schema.stories.position}), 0)::int` })
    .from(schema.stories);
  const [story] = await db
    .insert(schema.stories)
    .values({
      title: "Untitled story",
      slug: `untitled-${Date.now().toString(36)}`,
      author: user.name || "",
      position: min - 1,
    })
    .returning({ id: schema.stories.id });
  redirect(`/admin/stories/${story.id}`);
}

const storySchema = z.object({
  title: z.string().trim().min(1, "Add a title").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Add a web address")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  excerpt: z.string().max(600),
  body: z.string().max(500_000),
  coverUrl: z.string().max(2000),
  coverAlt: z.string().max(500),
  author: z.string().max(120),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().max(40),
  seoTitle: z.string().max(200),
  seoDescription: z.string().max(400),
});

export type StoryInput = z.infer<typeof storySchema>;

export async function saveStory(id: number, input: StoryInput): Promise<Result<{ publishedAt: string | null }>> {
  await requireAdmin();
  try {
    const data = storySchema.parse(input);
    const db = getDb();
    const clash = await db
      .select({ id: schema.stories.id })
      .from(schema.stories)
      .where(sql`${schema.stories.slug} = ${data.slug} and ${schema.stories.id} <> ${id}`)
      .limit(1);
    if (clash.length) return { ok: false, error: "Another story already uses this web address." };

    let publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
    if (publishedAt && Number.isNaN(publishedAt.getTime())) publishedAt = null;
    if (data.status === "published" && !publishedAt) publishedAt = new Date();

    await db
      .update(schema.stories)
      .set({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        body: data.body,
        coverUrl: data.coverUrl || null,
        coverAlt: data.coverAlt,
        author: data.author,
        status: data.status,
        publishedAt,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        updatedAt: new Date(),
      })
      .where(eq(schema.stories.id, id));
    refreshSite();
    return { ok: true, data: { publishedAt: publishedAt ? publishedAt.toISOString() : null } };
  } catch (error) {
    return failure(error, "Could not save the story.");
  }
}

export async function deleteStory(id: number): Promise<Result> {
  await requireAdmin();
  try {
    await getDb().delete(schema.stories).where(eq(schema.stories.id, id));
    refreshSite();
    return { ok: true };
  } catch (error) {
    return failure(error, "Could not delete the story.");
  }
}

export async function reorderStories(ids: number[]): Promise<Result> {
  await requireAdmin();
  try {
    const order = z.array(z.number().int()).max(1000).parse(ids);
    await getDb().transaction(async (tx) => {
      for (const [position, id] of order.entries()) {
        await tx.update(schema.stories).set({ position }).where(eq(schema.stories.id, id));
      }
    });
    refreshSite();
    return { ok: true };
  } catch (error) {
    return failure(error, "Could not save the new order.");
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Media                                    */
/* -------------------------------------------------------------------------- */

export async function listMedia() {
  await requireAdmin();
  return getDb().select().from(schema.media).orderBy(desc(schema.media.createdAt), desc(schema.media.id));
}

export async function updateMediaAlt(id: number, alt: string): Promise<Result> {
  await requireAdmin();
  try {
    await getDb()
      .update(schema.media)
      .set({ alt: z.string().max(500).parse(alt) })
      .where(eq(schema.media.id, id));
    return { ok: true };
  } catch (error) {
    return failure(error, "Could not save the description.");
  }
}

export async function deleteMedia(id: number): Promise<Result> {
  await requireAdmin();
  try {
    const db = getDb();
    const [row] = await db.select().from(schema.media).where(eq(schema.media.id, id)).limit(1);
    if (!row) return { ok: true };
    await removeFile(row.url, row.pathname);
    await db.delete(schema.media).where(eq(schema.media.id, id));
    return { ok: true };
  } catch (error) {
    return failure(error, "Could not delete the image.");
  }
}

