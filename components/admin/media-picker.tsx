"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { listMedia } from "@/lib/admin/actions";
import type { Media } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

import { Button, Input, Modal } from "./ui";
import { uploadImage } from "./upload";

/** Choose an image from the library, or upload a new one. */
export function MediaPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
}) {
  const [items, setItems] = useState<Media[] | null>(null);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(0);
  const [, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    startTransition(async () => setItems(await listMedia()));
  }, [open]);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files);
    setUploading((n) => n + list.length);
    let last: Media | null = null;
    for (const file of list) {
      try {
        const media = await uploadImage(file);
        last = media;
        setItems((current) => [media, ...(current ?? [])]);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed.");
      } finally {
        setUploading((n) => n - 1);
      }
    }
    // A single upload is almost always the image you meant to pick.
    if (list.length === 1 && last) {
      onSelect(last);
      onClose();
    }
  }

  const filtered = (items ?? []).filter((m) =>
    query ? `${m.alt} ${m.pathname}`.toLowerCase().includes(query.toLowerCase()) : true,
  );

  return (
    <Modal open={open} onClose={onClose} title="Choose an image" wide>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search by description or file name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sm:max-w-sm"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            className="hidden"
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button variant="primary" onClick={() => fileRef.current?.click()} disabled={uploading > 0}>
            {uploading > 0 ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading > 0 ? `Uploading ${uploading}` : "Upload new image"}
          </Button>
        </div>

        {items === null ? (
          <p className="py-16 text-center text-frantoio/50">Loading your images…</p>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-frantoio/50">
            {items.length === 0 ? "No images yet. Upload one to get started." : "No images match your search."}
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((media) => (
              <li key={media.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(media);
                    onClose();
                  }}
                  className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-white ring-leaf focus-visible:ring-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={media.url} alt={media.alt} loading="lazy" className="size-full object-cover" />
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center bg-frantoio/50 text-limestone opacity-0 transition-opacity group-hover:opacity-100",
                    )}
                  >
                    <Check className="size-5" aria-hidden="true" />
                    <span className="sr-only">Use {media.alt || media.pathname}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
