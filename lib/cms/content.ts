import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getDb, hasDatabase, schema } from "@/lib/db";

import { DEFAULT_NAVIGATION, type Navigation } from "./defaults-nav";
import { withDefaults } from "./fields";
import { DEFAULTS, type SectionContent, type SectionKey } from "./sections";

/** Every public read is tagged with this, and every admin save expires it. */
export const CMS_TAG = "cms";

const loadContent = unstable_cache(
  async (): Promise<Record<string, unknown>> => {
    const rows = await getDb().select().from(schema.contentBlocks);
    return Object.fromEntries(rows.map((row) => [row.key, row.data]));
  },
  ["cms-content-v1"],
  { tags: [CMS_TAG] },
);

async function savedContent(): Promise<Record<string, unknown>> {
  if (!hasDatabase()) return {};
  try {
    return await loadContent();
  } catch (error) {
    console.error("CMS content unavailable, showing defaults:", error);
    return {};
  }
}

export async function getContent<K extends SectionKey>(key: K): Promise<SectionContent<K>> {
  const saved = await savedContent();
  return withDefaults(DEFAULTS[key] as Record<string, unknown>, saved[key]) as SectionContent<K>;
}

/* ------------------------------- Navigation ------------------------------- */

const loadNavigation = unstable_cache(
  async (): Promise<Navigation | null> => {
    const db = getDb();
    const menus = await db.select().from(schema.menus).orderBy(asc(schema.menus.position), asc(schema.menus.id));
    if (menus.length === 0) return null;
    const items = await db
      .select()
      .from(schema.menuItems)
      .orderBy(asc(schema.menuItems.position), asc(schema.menuItems.id));
    const itemsFor = (menuId: number) =>
      items
        .filter((item) => item.menuId === menuId)
        .map((item) => ({ id: item.id, label: item.label, href: item.href, newTab: item.newTab }));

    const header = menus.find((m) => m.location === "header");
    return {
      header: header ? itemsFor(header.id) : [],
      footer: menus
        .filter((m) => m.location === "footer")
        .map((m) => ({
          id: m.id,
          title: m.title,
          includeCollections: m.includeCollections,
          items: itemsFor(m.id),
        })),
    };
  },
  ["cms-navigation-v1"],
  { tags: [CMS_TAG] },
);

export async function getNavigation(): Promise<Navigation> {
  if (!hasDatabase()) return DEFAULT_NAVIGATION;
  try {
    return (await loadNavigation()) ?? DEFAULT_NAVIGATION;
  } catch (error) {
    console.error("Navigation unavailable, showing defaults:", error);
    return DEFAULT_NAVIGATION;
  }
}

/* --------------------------------- Stories -------------------------------- */

export type PublicStory = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl: string | null;
  coverAlt: string;
  author: string;
  publishedAt: string | null;
  seoTitle: string;
  seoDescription: string;
};

function toPublic(row: typeof schema.stories.$inferSelect): PublicStory {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    coverUrl: row.coverUrl,
    coverAlt: row.coverAlt,
    author: row.author,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
  };
}

const loadStories = unstable_cache(
  async (): Promise<PublicStory[]> => {
    const rows = await getDb()
      .select()
      .from(schema.stories)
      .where(eq(schema.stories.status, "published"))
      .orderBy(asc(schema.stories.position), desc(schema.stories.publishedAt));
    return rows.map(toPublic);
  },
  ["cms-stories-v1"],
  { tags: [CMS_TAG] },
);

/** Published stories whose publish date has arrived, in the order set in the admin. */
export async function getPublishedStories(limit?: number): Promise<PublicStory[]> {
  if (!hasDatabase()) return [];
  try {
    const now = Date.now();
    const list = (await loadStories()).filter(
      (story) => !story.publishedAt || new Date(story.publishedAt).getTime() <= now,
    );
    return limit ? list.slice(0, limit) : list;
  } catch (error) {
    console.error("Stories unavailable:", error);
    return [];
  }
}

export async function getStoryBySlug(slug: string): Promise<PublicStory | null> {
  const stories = await getPublishedStories();
  return stories.find((story) => story.slug === slug) ?? null;
}

