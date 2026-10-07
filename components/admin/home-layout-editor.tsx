"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { saveHomeLayout } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

import { DragHandle, SortableItem, SortableList } from "./sortable";
import { Button, useUnsavedWarning } from "./ui";

type Row = { id: string; visible: boolean };

const EDIT_LINKS: Record<string, string> = {
  hero: "/admin/content/home.hero",
  ribbon: "/admin/content/home.ribbon",
  story: "/admin/content/home.story",
  flagship: "/admin/content/flagship",
  collection: "/admin/content/home.collection",
  region: "/admin/content/home.region",
  mission: "/admin/content/home.mission",
  gallery: "/admin/content/home.gallery",
  why: "/admin/content/home.why",
  labelGuide: "/admin/content/home.labelGuide",
  stories: "/admin/stories",
};

export function HomeLayoutEditor({ initial, labels }: { initial: Row[]; labels: Record<string, string> }) {
  const [rows, setRows] = useState(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(rows) !== saved;
  useUnsavedWarning(dirty);

  function save() {
    startTransition(async () => {
      const result = await saveHomeLayout(rows);
      if (result.ok) {
        setSaved(JSON.stringify(rows));
        toast.success("Homepage layout saved.");
      } else toast.error(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <SortableList items={rows} onChange={setRows} className="flex flex-col gap-2">
        {(row, index) => (
          <SortableItem
            key={row.id}
            id={row.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-frantoio/10 bg-white p-2.5 pr-3",
              !row.visible && "bg-white/50",
            )}
          >
            <DragHandle label={`Drag ${labels[row.id]}`} />
            <span className="w-6 text-right text-[0.8125rem] text-frantoio/40 tabular-nums">{index + 1}</span>
            <span className={cn("flex-1 font-medium", !row.visible && "text-frantoio/40 line-through")}>
              {labels[row.id] ?? row.id}
            </span>
            <Link href={EDIT_LINKS[row.id] ?? "/admin/content"} className="text-[0.875rem] font-semibold text-frantoio/60 hover:text-leaf">
              Edit content
            </Link>
            <Button
              size="sm"
              variant="ghost"
              aria-pressed={!row.visible}
              onClick={() => setRows(rows.map((r) => (r.id === row.id ? { ...r, visible: !r.visible } : r)))}
            >
              {row.visible ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
              {row.visible ? "Shown" : "Hidden"}
            </Button>
          </SortableItem>
        )}
      </SortableList>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={save} disabled={!dirty || pending}>
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Save layout
        </Button>
        <Button variant="ghost" onClick={() => setRows(JSON.parse(saved))} disabled={!dirty || pending}>
          Discard
        </Button>
        <span className="text-[0.8125rem] text-frantoio/55">{dirty ? "Unsaved changes" : "All changes saved"}</span>
      </div>
    </div>
  );
}
