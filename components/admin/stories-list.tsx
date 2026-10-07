"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { reorderStories } from "@/lib/admin/actions";

import { DragHandle, SortableItem, SortableList } from "./sortable";
import { Badge } from "./ui";

export type StoryRow = {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  publishedAt: string | null;
  updatedAt: string;
  coverUrl: string | null;
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));

export function StoriesList({ initial }: { initial: StoryRow[] }) {
  const [rows, setRows] = useState(initial);
  const [, startTransition] = useTransition();

  function reorder(next: StoryRow[]) {
    const previous = rows;
    setRows(next);
    startTransition(async () => {
      const result = await reorderStories(next.map((r) => r.id));
      if (result.ok) toast.success("Order saved.");
      else {
        setRows(previous);
        toast.error(result.error);
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-frantoio/20 p-12 text-center text-frantoio/55">
        No stories yet. Use “New story” to write the first one.
      </div>
    );
  }

  return (
    <SortableList items={rows} onChange={reorder} className="flex flex-col gap-2">
      {(row) => {
        const scheduled = row.status === "published" && row.publishedAt && new Date(row.publishedAt) > new Date();
        return (
          <SortableItem key={row.id} id={row.id} className="flex items-center gap-3 rounded-xl border border-frantoio/10 bg-white p-2.5 pr-4">
            <DragHandle label={`Drag ${row.title}`} />
            <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
              {row.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.coverUrl} alt="" className="size-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/admin/stories/${row.id}`} className="block truncate font-display text-[1.25rem] leading-tight hover:text-leaf">
                {row.title}
              </Link>
              <p className="truncate text-[0.8125rem] text-frantoio/55">
                /stories/{row.slug} · edited {fmt(row.updatedAt)}
              </p>
            </div>
            <Badge tone={row.status === "published" ? "green" : "amber"}>
              {row.status === "published" ? (scheduled ? `Scheduled ${fmt(row.publishedAt!)}` : "Published") : "Draft"}
            </Badge>
          </SortableItem>
        );
      }}
    </SortableList>
  );
}
