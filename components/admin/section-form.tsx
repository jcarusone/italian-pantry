"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ChevronDown, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { resetSection, saveSection } from "@/lib/admin/actions";
import type { Field, ImageValue, LinkValue, SectionDef } from "@/lib/cms/fields";
import { cn } from "@/lib/utils";

import { ImageField } from "./image-field";
import { DragHandle, SortableItem, SortableList } from "./sortable";
import { Button, Field as FieldShell, Input, Textarea, Toggle, useUnsavedWarning } from "./ui";

type Values = Record<string, unknown>;
type Item = Values & { __id: string };

let counter = 0;
const newId = () => `i${Date.now().toString(36)}${(counter++).toString(36)}`;

/** Lists need stable ids for drag and drop; they're added here and removed before saving. */
function withIds(fields: Field[], values: Values): Values {
  const out: Values = { ...values };
  for (const field of fields) {
    if (field.type === "list" && Array.isArray(values[field.name])) {
      out[field.name] = (values[field.name] as Values[]).map((item) => ({
        ...withIds(field.fields, item),
        __id: newId(),
      }));
    }
  }
  return out;
}

function withoutIds(fields: Field[], values: Values): Values {
  const out: Values = {};
  for (const field of fields) {
    const value = values[field.name];
    out[field.name] =
      field.type === "list" && Array.isArray(value)
        ? (value as Values[]).map((item) => withoutIds(field.fields, item))
        : value;
  }
  return out;
}

function emptyValue(field: Field): unknown {
  switch (field.type) {
    case "number":
      return 0;
    case "boolean":
      return false;
    case "image":
      return { url: "", alt: "" };
    case "link":
      return { label: "", href: "" };
    case "list":
      return [];
    default:
      return "";
  }
}

function itemTitle(field: Extract<Field, { type: "list" }>, item: Values, index: number) {
  const value = item[field.titleField];
  if (typeof value === "string" && value.trim()) return value;
  if (value && typeof value === "object" && "alt" in value) {
    const alt = (value as ImageValue).alt;
    if (alt) return alt;
  }
  return `${field.itemLabel[0].toUpperCase()}${field.itemLabel.slice(1)} ${index + 1}`;
}

function ListField({
  field,
  value,
  onChange,
  path,
}: {
  field: Extract<Field, { type: "list" }>;
  value: Item[];
  onChange: (value: Item[]) => void;
  path: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const simple = field.fields.length === 1 && field.fields[0].type === "text";

  function update(id: string, next: Values) {
    onChange(value.map((item) => (item.__id === id ? ({ ...next, __id: id } as Item) : item)));
  }

  function add() {
    const item = Object.fromEntries(field.fields.map((f) => [f.name, emptyValue(f)])) as Values;
    const id = newId();
    onChange([...value, { ...item, __id: id }]);
    setOpen(id);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.875rem] font-semibold">{field.label}</span>
        <span className="text-[0.8125rem] text-frantoio/50">
          {value.length} {value.length === 1 ? field.itemLabel : `${field.itemLabel}s`} · drag to reorder
        </span>
      </div>
      {field.help ? <p className="-mt-1 text-[0.8125rem] text-frantoio/55">{field.help}</p> : null}

      <SortableList
        items={value.map((item) => ({ ...item, id: item.__id }) as Item & { id: string })}
        onChange={(items) => onChange(items)}
        className="flex flex-col gap-2"
      >
        {(item, index) => {
          const expanded = open === item.__id;
          return (
            <SortableItem key={item.__id} id={item.__id} className="rounded-xl border border-frantoio/12 bg-white">
              {simple ? (
                <div className="flex items-center gap-2 p-2">
                  <DragHandle />
                  <Input
                    aria-label={`${field.itemLabel} ${index + 1}`}
                    value={String(item[field.fields[0].name] ?? "")}
                    onChange={(e) => update(item.__id, { ...item, [field.fields[0].name]: e.target.value })}
                    className="h-9 border-transparent shadow-none focus:border-leaf"
                  />
                  <RemoveButton label={field.itemLabel} onClick={() => onChange(value.filter((v) => v.__id !== item.__id))} />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 p-2">
                    <DragHandle />
                    <button
                      type="button"
                      onClick={() => setOpen(expanded ? null : item.__id)}
                      aria-expanded={expanded}
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1.5 text-left text-[0.9375rem] font-medium hover:text-leaf"
                    >
                      <span className="truncate">{itemTitle(field, item, index)}</span>
                      <ChevronDown className={cn("ml-auto size-4 shrink-0 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
                    </button>
                    <RemoveButton label={field.itemLabel} onClick={() => onChange(value.filter((v) => v.__id !== item.__id))} />
                  </div>
                  {expanded ? (
                    <div className="flex flex-col gap-4 border-t border-frantoio/8 p-4">
                      {field.fields.map((sub) => (
                        <FieldInput
                          key={sub.name}
                          field={sub}
                          path={`${path}-${index}-${sub.name}`}
                          value={item[sub.name]}
                          onChange={(next) => update(item.__id, { ...item, [sub.name]: next })}
                        />
                      ))}
                    </div>
                  ) : null}
                </>
              )}
            </SortableItem>
          );
        }}
      </SortableList>

      <Button size="sm" variant="secondary" onClick={add} className="self-start">
        <Plus className="size-3.5" aria-hidden="true" />
        Add {field.itemLabel}
      </Button>
    </div>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-8 shrink-0 items-center justify-center rounded-md text-frantoio/40 hover:bg-pomodoro/10 hover:text-pomodoro"
    >
      <Trash2 className="size-4" aria-hidden="true" />
      <span className="sr-only">Remove {label}</span>
    </button>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  path,
}: {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string;
}) {
  const id = `f-${path}`;
  switch (field.type) {
    case "text":
      return (
        <FieldShell label={field.label} help={field.help} htmlFor={id}>
          <Input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </FieldShell>
      );
    case "textarea":
      return (
        <FieldShell label={field.label} help={field.help} htmlFor={id}>
          <Textarea id={id} rows={field.rows ?? 4} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </FieldShell>
      );
    case "lines": {
      const text = String(value ?? "");
      return (
        <FieldShell label={field.label} help={field.help} htmlFor={id}>
          <Textarea
            id={id}
            rows={Math.max(2, text.split("\n").length)}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            className="font-display text-[1.25rem] leading-snug"
          />
        </FieldShell>
      );
    }
    case "number":
      return (
        <FieldShell label={field.label} help={field.help} htmlFor={id}>
          <Input id={id} type="number" inputMode="decimal" value={String(value ?? 0)} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} className="max-w-40" />
        </FieldShell>
      );
    case "boolean":
      return <Toggle id={id} checked={Boolean(value)} onChange={onChange} label={field.label} />;
    case "link": {
      const link = (value as LinkValue) ?? { label: "", href: "" };
      return (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-[0.875rem] font-semibold">{field.label}</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Input aria-label={`${field.label} text`} placeholder="Button text" value={link.label} onChange={(e) => onChange({ ...link, label: e.target.value })} />
            <Input aria-label={`${field.label} address`} placeholder="/products or https://…" value={link.href} onChange={(e) => onChange({ ...link, href: e.target.value })} />
          </div>
          <p className="text-[0.8125rem] text-frantoio/55">{field.help ?? "Leave the text empty to hide this button."}</p>
        </fieldset>
      );
    }
    case "image":
      return (
        <FieldShell label={field.label} help={field.help}>
          <ImageField id={id} value={(value as ImageValue) ?? { url: "", alt: "" }} onChange={onChange} />
        </FieldShell>
      );
    case "list":
      return <ListField field={field} path={path} value={(value as Item[]) ?? []} onChange={onChange} />;
  }
}

export function SectionForm({ def, initial }: { def: SectionDef; initial: Values }) {
  const start = useMemo(() => withIds(def.fields, initial), [def.fields, initial]);
  const [values, setValues] = useState<Values>(start);
  const [saved, setSaved] = useState(() => JSON.stringify(withoutIds(def.fields, start)));
  const [pending, startTransition] = useTransition();

  const current = JSON.stringify(withoutIds(def.fields, values));
  const dirty = current !== saved;
  useUnsavedWarning(dirty);

  function save() {
    startTransition(async () => {
      const result = await saveSection(def.key, withoutIds(def.fields, values));
      if (result.ok) {
        setSaved(current);
        toast.success(`${def.title} saved. The site is updated.`);
      } else {
        toast.error(result.error);
      }
    });
  }

  function reset() {
    if (!window.confirm(`Put “${def.title}” back to the original text and images? Your changes to this section will be lost.`)) return;
    startTransition(async () => {
      const result = await resetSection(def.key);
      if (result.ok && result.data) {
        const fresh = withIds(def.fields, result.data as Values);
        setValues(fresh);
        setSaved(JSON.stringify(withoutIds(def.fields, fresh)));
        toast.success("Section reset to the original.");
      } else if (!result.ok) {
        toast.error(result.error);
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="pb-28"
    >
      <div className="flex flex-col gap-6 rounded-2xl border border-frantoio/10 bg-white/60 p-5 md:p-7">
        {def.fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            path={field.name}
            value={values[field.name]}
            onChange={(next) => setValues((v) => ({ ...v, [field.name]: next }))}
          />
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-frantoio/10 bg-limestone/90 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-5 py-3 md:px-10">
          <Button type="submit" variant="primary" disabled={!dirty || pending}>
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Save changes
          </Button>
          <Button variant="ghost" disabled={!dirty || pending} onClick={() => setValues(withIds(def.fields, JSON.parse(saved)))}>
            Discard
          </Button>
          <span className="text-[0.8125rem] text-frantoio/55" aria-live="polite">
            {dirty ? "Unsaved changes" : "All changes saved"}
          </span>
          <span className="ml-auto flex gap-2">
            <Link href={def.preview} target="_blank" className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[0.875rem] font-semibold text-frantoio/75 hover:bg-frantoio/6">
              View on site
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </Link>
            <Button variant="ghost" onClick={reset} disabled={pending}>
              Reset to original
            </Button>
          </span>
        </div>
      </div>
    </form>
  );
}
