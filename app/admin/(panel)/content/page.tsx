import Link from "next/link";

import { PageTitle } from "@/components/admin/ui";
import { SECTIONS } from "@/lib/cms/sections";
import { getDb, schema } from "@/lib/db";

export const metadata = { title: "Page content" };

export default async function ContentIndex() {
  const rows = await getDb()
    .select({ key: schema.contentBlocks.key, updatedAt: schema.contentBlocks.updatedAt, updatedBy: schema.contentBlocks.updatedBy })
    .from(schema.contentBlocks);
  const edited = new Map(rows.map((r) => [r.key, r]));
  const groups = Array.from(new Set(SECTIONS.map((s) => s.group)));
  const fmt = (d: Date) => new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(d);

  return (
    <>
      <PageTitle
        title="Page content"
        description="Every piece of text and every image on the site, apart from products (those are in Shopify). Choose a section to edit it."
      />
      <div className="flex flex-col gap-10">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="mb-3 text-[0.875rem] font-semibold text-frantoio/55">{group}</h2>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {SECTIONS.filter((s) => s.group === group).map((section) => {
                const row = edited.get(section.key);
                return (
                  <li key={section.key}>
                    <Link
                      href={`/admin/content/${section.key}`}
                      className="group flex h-full flex-col rounded-2xl border border-frantoio/10 bg-white p-5 transition-colors hover:border-frantoio/30"
                    >
                      <span className="font-display text-[1.375rem] group-hover:text-leaf">{section.title}</span>
                      <span className="mt-1 text-[0.875rem] leading-snug text-frantoio/60">{section.description}</span>
                      <span className="mt-3 text-[0.75rem] text-frantoio/40">
                        {row && row.updatedBy !== "seed" ? `Last edited ${fmt(row.updatedAt)}` : "Original content"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
