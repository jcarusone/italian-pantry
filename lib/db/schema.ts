import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Editable copy for each section of the site, stored as JSON keyed by section. */
export const contentBlocks = pgTable("content_blocks", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: text("updated_by"),
});

/** A navigation menu: the header bar, or one column of the footer. */
export const menus = pgTable("menus", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location", { enum: ["header", "footer"] }).notNull(),
  position: integer("position").notNull().default(0),
  /** Append the Shopify collections automatically (used for the footer's Shop column). */
  includeCollections: boolean("include_collections").notNull().default(false),
});

export const menuItems = pgTable(
  "menu_items",
  {
    id: serial("id").primaryKey(),
    menuId: integer("menu_id")
      .notNull()
      .references(() => menus.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    href: text("href").notNull(),
    position: integer("position").notNull().default(0),
    newTab: boolean("new_tab").notNull().default(false),
  },
  (t) => [index("menu_items_menu_idx").on(t.menuId, t.position)],
);

export const stories = pgTable(
  "stories",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    body: text("body").notNull().default(""),
    coverUrl: text("cover_url"),
    coverAlt: text("cover_alt").notNull().default(""),
    author: text("author").notNull().default(""),
    status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    position: integer("position").notNull().default(0),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("stories_slug_idx").on(t.slug), index("stories_position_idx").on(t.position)],
);

/** Every uploaded image, so it can be reused anywhere on the site. */
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  pathname: text("pathname").notNull(),
  alt: text("alt").notNull().default(""),
  width: integer("width"),
  height: integer("height"),
  size: integer("size"),
  contentType: text("content_type"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Menu = typeof menus.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Story = typeof stories.$inferSelect;
export type Media = typeof media.$inferSelect;
