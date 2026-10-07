import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { FileText, Home, Images, LayoutList, Newspaper } from "lucide-react";

import { Badge, Card } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/session";
import { getDb, schema } from "@/lib/db";
import { usesVercelBlob } from "@/lib/storage";

export const metadata = { title: "Dashboard" };

const fmt = (d: Date) => new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeStyle: "short" }).format(d);

export default async function Dashboard() {
  const user = await requireAdmin();
  const db = getDb();
  const [[published], [drafts], [images], recent, edits] = await Promise.all([
    db.select({ n: count() }).from(schema.stories).where(eq(schema.stories.status, "published")),
    db.select({ n: count() }).from(schema.stories).where(eq(schema.stories.status, "draft")),
    db.select({ n: count() }).from(schema.media),
    db.select().from(schema.stories).orderBy(desc(schema.stories.updatedAt)).limit(5),
    db.select().from(schema.contentBlocks).orderBy(desc(schema.contentBlocks.updatedAt)).limit(5),
  ]);

  const tiles = [
    { href: "/admin/homepage", icon: Home, title: "Homepage layout", body: "Reorder, show or hide homepage sections." },
    { href: "/admin/content", icon: FileText, title: "Page content", body: "Edit text and images across the site." },
    { href: "/admin/navigation", icon: LayoutList, title: "Menus", body: "Header and footer links and their order." },
    { href: "/admin/stories", icon: Newspaper, title: "Stories", body: `${published.n} published, ${drafts.n} in draft.` },
    { href: "/admin/media", icon: Images, title: "Images", body: `${images.n} in the library.` },
  ];

  return (
    <>
      <div className="mb-10">
        <h1 className="font-display text-[2.5rem] leading-tight">Ciao{user.name ? `, ${user.name.split(" ")[0]}` : ""}.</h1>
        <p className="mt-2 text-frantoio/60">Products, prices and orders are managed in Shopify. Everything else is here.</p>
      </div>

      {!usesVercelBlob() ? (
        <p className="mb-8 rounded-xl bg-olio/20 px-4 py-3 text-[0.875rem] text-[#6d5413]">
          Images are being saved locally. Connect a Vercel Blob store to this project before going live.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href} className="group rounded-2xl border border-frantoio/10 bg-white p-6 transition-colors hover:border-frantoio/30">
            <tile.icon className="size-5 text-gold" aria-hidden="true" />
            <h2 className="mt-4 font-display text-[1.5rem] group-hover:text-leaf">{tile.title}</h2>
            <p className="mt-1 text-[0.875rem] text-frantoio/60">{tile.body}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-[1.375rem]">Recently edited stories</h2>
          <ul className="mt-4 flex flex-col divide-y divide-frantoio/8">
            {recent.length === 0 ? <li className="py-3 text-frantoio/50">No stories yet.</li> : null}
            {recent.map((story) => (
              <li key={story.id} className="flex items-center gap-3 py-3">
                <Link href={`/admin/stories/${story.id}`} className="min-w-0 flex-1 truncate font-medium hover:text-leaf">
                  {story.title}
                </Link>
                <Badge tone={story.status === "published" ? "green" : "amber"}>
                  {story.status === "published" ? "Published" : "Draft"}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-display text-[1.375rem]">Recent content changes</h2>
          <ul className="mt-4 flex flex-col divide-y divide-frantoio/8">
            {edits.map((edit) => (
              <li key={edit.key} className="flex items-center gap-3 py-3 text-[0.9375rem]">
                <Link href={edit.key === "home.layout" ? "/admin/homepage" : `/admin/content/${edit.key}`} className="min-w-0 flex-1 truncate font-medium hover:text-leaf">
                  {edit.key}
                </Link>
                <span className="shrink-0 text-[0.8125rem] text-frantoio/50">
                  {fmt(edit.updatedAt)}
                  {edit.updatedBy && edit.updatedBy !== "seed" ? ` · ${edit.updatedBy}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
