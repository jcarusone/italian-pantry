import { z } from "zod";

/**
 * Field types the admin knows how to edit. Each section of the site declares its
 * fields once; the admin form, validation and defaults are all derived from that.
 */
export type Field =
  | { type: "text"; name: string; label: string; help?: string }
  | { type: "textarea"; name: string; label: string; help?: string; rows?: number }
  /** A heading whose line breaks are part of the design: one line of text per line. */
  | { type: "lines"; name: string; label: string; help?: string }
  | { type: "number"; name: string; label: string; help?: string }
  | { type: "boolean"; name: string; label: string; help?: string }
  | { type: "link"; name: string; label: string; help?: string }
  | { type: "image"; name: string; label: string; help?: string }
  | {
      type: "list";
      name: string;
      label: string;
      help?: string;
      /** Singular noun for the "Add …" button, e.g. "question". */
      itemLabel: string;
      /** Which sub-field to show as the collapsed row's title. */
      titleField: string;
      fields: Field[];
    };

export type ImageValue = { url: string; alt: string };
export type LinkValue = { label: string; href: string };

export type SectionDef = {
  key: string;
  title: string;
  group: string;
  description: string;
  /** Public page to open when previewing this section. */
  preview: string;
  fields: Field[];
};

const MAX = 20000;

function fieldSchema(field: Field): z.ZodTypeAny {
  switch (field.type) {
    case "text":
    case "textarea":
    case "lines":
      return z.string().max(MAX);
    case "number":
      return z.coerce.number().finite();
    case "boolean":
      return z.boolean();
    case "link":
      return z.object({ label: z.string().max(200), href: z.string().max(2000) });
    case "image":
      return z.object({ url: z.string().max(2000), alt: z.string().max(500) });
    case "list":
      return z.array(objectSchema(field.fields)).max(100);
  }
}

function objectSchema(fields: Field[]) {
  return z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)])));
}

export function sectionSchema(def: SectionDef) {
  return objectSchema(def.fields);
}

/** Overlay saved data on the defaults, so fields added later still have a value. */
export function withDefaults<T extends Record<string, unknown>>(defaults: T, data: unknown): T {
  if (!data || typeof data !== "object") return defaults;
  const saved = data as Record<string, unknown>;
  const out: Record<string, unknown> = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const value = saved[key];
    if (value === undefined || value === null) continue;
    const fallback = defaults[key];
    if (Array.isArray(fallback) ? Array.isArray(value) : typeof value === typeof fallback) {
      out[key] = value;
    }
  }
  return out as T;
}
