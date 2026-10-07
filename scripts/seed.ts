/**
 * Fill a new database with the site's current content: `npm run db:seed`
 * Safe to run more than once: it only adds what is missing and never overwrites edits.
 */
import "./load-env";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { DEFAULT_NAVIGATION } from "../lib/cms/defaults-nav";
import { DEFAULTS } from "../lib/cms/sections";
import * as schema from "../lib/db/schema";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL first.");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  // Content for every section.
  for (const [key, data] of Object.entries(DEFAULTS)) {
    await db.insert(schema.contentBlocks).values({ key, data, updatedBy: "seed" }).onConflictDoNothing();
  }
  console.log(`Content: ${Object.keys(DEFAULTS).length} sections checked.`);

  // Menus, only if none exist yet.
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(schema.menus);
  if (count === 0) {
    const [header] = await db
      .insert(schema.menus)
      .values({ title: "Header", location: "header", position: 0 })
      .returning();
    await db.insert(schema.menuItems).values(
      DEFAULT_NAVIGATION.header.map((item, position) => ({ ...item, menuId: header.id, position })),
    );
    for (const [position, column] of DEFAULT_NAVIGATION.footer.entries()) {
      const [menu] = await db
        .insert(schema.menus)
        .values({
          title: column.title,
          location: "footer",
          position,
          includeCollections: column.includeCollections,
        })
        .returning();
      if (column.items.length) {
        await db
          .insert(schema.menuItems)
          .values(column.items.map((item, i) => ({ ...item, menuId: menu.id, position: i })));
      }
    }
    console.log("Menus: header and footer created.");
  } else {
    console.log("Menus: already set up, left unchanged.");
  }

  // One draft story so the editor isn't empty. It stays unpublished until you publish it.
  const [{ stories }] = await db.select({ stories: sql<number>`count(*)::int` }).from(schema.stories);
  if (stories === 0) {
    await db.insert(schema.stories).values({
      slug: "how-to-read-a-product-of-italy-label",
      title: "How to read a “Product of Italy” label",
      excerpt:
        "Why “Product of Italy” doesn't always mean the ingredients were grown in Italy, and what to look for instead.",
      body: [
        "<p>Under current Canadian and EU regulations, food can be labelled <em>“Product of Italy”</em> if the final processing or packaging took place in Italy, even if the raw ingredients were grown elsewhere. This is legal, but it is not what most people expect when they see that label.</p>",
        "<h2>What to look for</h2>",
        "<ul><li>Ingredients grown in Italy, not just packaged there</li><li>No seed oil blending in olive oil</li><li>A short, simple ingredient list</li><li>A named producer or farm</li></ul>",
        "<p>At Italian Pantry, Italian-grown means Italian-grown. Our olive oil is pressed in Abruzzo from olives grown in Abruzzo.</p>",
      ].join(""),
      coverUrl: "/product-line/img-13.webp",
      coverAlt: "Shelves stocked with Italian olive oil, preserves and passata",
      author: "Italian Pantry",
      status: "draft",
      position: 0,
    });
    console.log("Stories: one draft story added.");
  }

  await pool.end();
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
