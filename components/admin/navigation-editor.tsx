"use client";

import {
  closestCorners,
  DndContext,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExternalLink, GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { saveNavigation } from "@/lib/admin/actions";
import type { Navigation } from "@/lib/cms/defaults-nav";
import { cn } from "@/lib/utils";

import { useSortSensors } from "./sortable";
import { Button, Input, Toggle, useUnsavedWarning } from "./ui";

type LinkRow = { id: string; label: string; href: string; newTab: boolean };
type Group = { id: string; kind: "header" | "footer"; title: string; includeCollections: boolean; items: LinkRow[] };

let n = 0;
const uid = (p: string) => `${p}${Date.now().toString(36)}${(n++).toString(36)}`;

function toGroups(nav: Navigation): Group[] {
  return [
    {
      id: "header",
      kind: "header",
      title: "Header",
      includeCollections: false,
      items: nav.header.map((l) => ({ ...l, id: uid("l") })),
    },
    ...nav.footer.map((col) => ({
      id: uid("g"),
      kind: "footer" as const,
      title: col.title,
      includeCollections: col.includeCollections,
      items: col.items.map((l) => ({ ...l, id: uid("l") })),
    })),
  ];
}

function toNavigation(groups: Group[]): Navigation {
  const strip = (l: LinkRow) => ({ label: l.label.trim(), href: l.href.trim(), newTab: l.newTab });
  return {
    header: groups[0].items.map(strip),
    footer: groups.slice(1).map((g) => ({
      title: g.title.trim(),
      includeCollections: g.includeCollections,
      items: g.items.map(strip),
    })),
  };
}

/* ------------------------------ Link row ------------------------------ */

function LinkItem({
  link,
  onChange,
  onRemove,
}: {
  link: LinkRow;
  onChange: (link: LinkRow) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `item:${link.id}`,
    data: { type: "item" },
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "flex items-start gap-1.5 rounded-xl border border-frantoio/12 bg-white p-2",
        isDragging && "relative z-20 opacity-80 shadow-xl",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-1 flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-frantoio/40 hover:bg-frantoio/6 hover:text-frantoio"
      >
        <GripVertical className="size-4" aria-hidden="true" />
        <span className="sr-only">Drag {link.label || "link"}</span>
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Input
          aria-label="Link text"
          placeholder="Link text"
          value={link.label}
          onChange={(e) => onChange({ ...link, label: e.target.value })}
          className="h-9 font-medium"
        />
        <Input
          aria-label="Link address"
          placeholder="/page or https://…"
          value={link.href}
          onChange={(e) => onChange({ ...link, href: e.target.value })}
          className="h-9 text-[0.875rem] text-frantoio/70"
        />
        <label className="flex items-center gap-2 px-1 text-[0.8125rem] text-frantoio/60">
          <input
            type="checkbox"
            checked={link.newTab}
            onChange={(e) => onChange({ ...link, newTab: e.target.checked })}
            className="size-3.5 accent-[var(--leaf)]"
          />
          Open in a new tab
        </label>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md text-frantoio/40 hover:bg-pomodoro/10 hover:text-pomodoro"
      >
        <Trash2 className="size-4" aria-hidden="true" />
        <span className="sr-only">Remove {link.label || "link"}</span>
      </button>
    </li>
  );
}

/* ------------------------------ Menu card ------------------------------ */

function MenuCard({
  group,
  onChange,
  onRemove,
  sortableColumn,
}: {
  group: Group;
  onChange: (group: Group) => void;
  onRemove?: () => void;
  sortableColumn: boolean;
}) {
  const sortable = useSortable({ id: `col:${group.id}`, data: { type: "column" }, disabled: !sortableColumn });
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `group:${group.id}`, data: { type: "group" } });

  const updateLink = (link: LinkRow) =>
    onChange({ ...group, items: group.items.map((l) => (l.id === link.id ? link : l)) });

  return (
    <section
      ref={sortableColumn ? sortable.setNodeRef : undefined}
      style={sortableColumn ? { transform: CSS.Translate.toString(sortable.transform), transition: sortable.transition } : undefined}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-frantoio/10 bg-white/60 p-4",
        sortable.isDragging && "relative z-30 shadow-2xl",
      )}
    >
      <div className="flex items-center gap-2">
        {sortableColumn ? (
          <button
            type="button"
            {...sortable.attributes}
            {...sortable.listeners}
            className="flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-frantoio/40 hover:bg-frantoio/6 hover:text-frantoio"
          >
            <GripVertical className="size-4" aria-hidden="true" />
            <span className="sr-only">Drag the {group.title} column</span>
          </button>
        ) : null}
        {group.kind === "header" ? (
          <h2 className="font-display text-[1.5rem]">Header menu</h2>
        ) : (
          <Input
            aria-label="Column title"
            value={group.title}
            placeholder="Column title"
            onChange={(e) => onChange({ ...group, title: e.target.value })}
            className="h-9 font-semibold"
          />
        )}
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-frantoio/40 hover:bg-pomodoro/10 hover:text-pomodoro"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            <span className="sr-only">Remove the {group.title} column</span>
          </button>
        ) : null}
      </div>

      <SortableContext items={group.items.map((l) => `item:${l.id}`)} strategy={verticalListSortingStrategy}>
        <ul
          ref={setDropRef}
          className={cn(
            "flex min-h-16 flex-col gap-2 rounded-xl p-0.5 transition-colors",
            isOver && "bg-leaf/8",
            group.kind === "header" && "md:grid md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {group.items.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              onChange={updateLink}
              onRemove={() => onChange({ ...group, items: group.items.filter((l) => l.id !== link.id) })}
            />
          ))}
          {group.items.length === 0 ? (
            <li className="flex items-center justify-center rounded-xl border border-dashed border-frantoio/20 p-4 text-[0.8125rem] text-frantoio/45">
              Drop links here
            </li>
          ) : null}
        </ul>
      </SortableContext>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          size="sm"
          onClick={() =>
            onChange({ ...group, items: [...group.items, { id: uid("l"), label: "", href: "/", newTab: false }] })
          }
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Add link
        </Button>
        {group.kind === "footer" ? (
          <Toggle
            checked={group.includeCollections}
            onChange={(value) => onChange({ ...group, includeCollections: value })}
            label="Add Shopify collections"
          />
        ) : null}
      </div>
    </section>
  );
}

/* ------------------------------- Editor ------------------------------- */

export function NavigationEditor({ initial }: { initial: Navigation }) {
  const [groups, setGroups] = useState<Group[]>(() => toGroups(initial));
  const [saved, setSaved] = useState(() => JSON.stringify(toNavigation(toGroups(initial))));
  const [pending, startTransition] = useTransition();
  const sensors = useSortSensors();

  const current = JSON.stringify(toNavigation(groups));
  const dirty = current !== saved;
  useUnsavedWarning(dirty);

  const findGroup = (itemId: string) => groups.findIndex((g) => g.items.some((l) => `item:${l.id}` === itemId));

  function containerOf(overId: string) {
    if (overId.startsWith("group:")) return groups.findIndex((g) => `group:${g.id}` === overId);
    if (overId.startsWith("item:")) return findGroup(overId);
    return -1;
  }

  // Moving a link into another menu happens while dragging, so the gap opens where it will land.
  function onDragOver({ active, over }: DragOverEvent) {
    if (!over || !String(active.id).startsWith("item:")) return;
    const from = findGroup(String(active.id));
    const to = containerOf(String(over.id));
    if (from < 0 || to < 0 || from === to) return;
    setGroups((prev) => {
      const next = prev.map((g) => ({ ...g, items: [...g.items] }));
      const index = next[from].items.findIndex((l) => `item:${l.id}` === active.id);
      const [moved] = next[from].items.splice(index, 1);
      const overIndex = next[to].items.findIndex((l) => `item:${l.id}` === over.id);
      next[to].items.splice(overIndex >= 0 ? overIndex : next[to].items.length, 0, moved);
      return next;
    });
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith("col:")) {
      const footer = groups.slice(1);
      const from = footer.findIndex((g) => `col:${g.id}` === activeId);
      const to = footer.findIndex((g) => `col:${g.id}` === overId || g.items.some((l) => `item:${l.id}` === overId));
      if (from >= 0 && to >= 0 && from !== to) setGroups([groups[0], ...arrayMove(footer, from, to)]);
      return;
    }

    const g = findGroup(activeId);
    if (g < 0) return;
    const from = groups[g].items.findIndex((l) => `item:${l.id}` === activeId);
    const to = groups[g].items.findIndex((l) => `item:${l.id}` === overId);
    if (to >= 0 && from !== to) {
      setGroups(groups.map((group, i) => (i === g ? { ...group, items: arrayMove(group.items, from, to) } : group)));
    }
  }

  function save() {
    startTransition(async () => {
      const result = await saveNavigation(toNavigation(groups));
      if (result.ok) {
        setSaved(current);
        toast.success("Menus saved. The site is updated.");
      } else {
        toast.error(result.error);
      }
    });
  }

  const footer = groups.slice(1);

  return (
    <div className="pb-28">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragOver={onDragOver} onDragEnd={onDragEnd}>
        <MenuCard
          group={groups[0]}
          sortableColumn={false}
          onChange={(group) => setGroups([group, ...footer])}
        />

        <div className="mt-10 mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-[1.5rem]">Footer columns</h2>
            <p className="text-[0.875rem] text-frantoio/60">
              Drag columns by their handle to change their order. Contact details are added after the columns automatically.
            </p>
          </div>
          <Button
            size="sm"
            disabled={footer.length >= 6}
            onClick={() =>
              setGroups([...groups, { id: uid("g"), kind: "footer", title: "New column", includeCollections: false, items: [] }])
            }
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Add column
          </Button>
        </div>

        <SortableContext items={footer.map((g) => `col:${g.id}`)} strategy={horizontalListSortingStrategy}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {footer.map((group) => (
              <MenuCard
                key={group.id}
                group={group}
                sortableColumn
                onChange={(next) => setGroups(groups.map((g) => (g.id === next.id ? next : g)))}
                onRemove={() => {
                  if (group.items.length && !window.confirm(`Remove the “${group.title}” column and its links?`)) return;
                  setGroups(groups.filter((g) => g.id !== group.id));
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-frantoio/10 bg-limestone/90 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-3 md:px-10">
          <Button variant="primary" onClick={save} disabled={!dirty || pending}>
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Save menus
          </Button>
          <Button variant="ghost" disabled={!dirty || pending} onClick={() => setGroups(toGroups(JSON.parse(saved)))}>
            Discard
          </Button>
          <span className="text-[0.8125rem] text-frantoio/55" aria-live="polite">
            {dirty ? "Unsaved changes" : "All changes saved"}
          </span>
          <a href="/" target="_blank" className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[0.875rem] font-semibold text-frantoio/75 hover:bg-frantoio/6">
            View site
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
