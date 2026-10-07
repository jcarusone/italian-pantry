"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

import type { ImageValue } from "@/lib/cms/fields";

import { MediaPicker } from "./media-picker";
import { Button, Input } from "./ui";

export function ImageField({
  value,
  onChange,
  id,
  compact = false,
}: {
  value: ImageValue;
  onChange: (value: ImageValue) => void;
  id: string;
  /** Stack the preview above the controls (for narrow sidebars). */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`flex flex-col gap-3 rounded-xl border border-frantoio/12 bg-white p-3 ${compact ? "" : "sm:flex-row sm:items-start"}`}>
      <div className={`relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-lg bg-secondary ${compact ? "" : "sm:w-40"}`}>
        {value.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value.url} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-frantoio/30">
            <ImageIcon className="size-6" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="primary" onClick={() => setOpen(true)}>
            {value.url ? "Replace image" : "Choose image"}
          </Button>
          {value.url ? (
            <Button size="sm" variant="ghost" onClick={() => onChange({ url: "", alt: "" })}>
              Remove
            </Button>
          ) : null}
        </div>
        <label htmlFor={`${id}-alt`} className="text-[0.8125rem] font-semibold text-frantoio/70">
          Image description (for screen readers and search engines)
        </label>
        <Input
          id={`${id}-alt`}
          value={value.alt}
          placeholder="Describe what's in the photo"
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
        />
      </div>
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(media) => onChange({ url: media.url, alt: media.alt || value.alt })}
      />
    </div>
  );
}
