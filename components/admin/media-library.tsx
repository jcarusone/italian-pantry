"use client";

import { useRef, useState, useTransition } from "react";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { deleteMedia, updateMediaAlt } from "@/lib/admin/actions";
import type { Media } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

import { Button, Input } from "./ui";
import { uploadImage } from "./upload";

function size(bytes: number | null) {
  if (!bytes) return "";
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function MediaCard({ media, onDeleted }: { media: Media; onDeleted: (id: number) => void }) {
  const [alt, setAlt] = useState(media.alt);
  const [savedAlt, setSavedAlt] = useState(media.alt);
  const [pending, startTransition] = useTransition();

  function saveAlt() {
    if (alt === savedAlt) return;
    startTransition(async () => {
      const result = await updateMediaAlt(media.id, alt);
      if (result.ok) {
        setSavedAlt(alt);
        toast.success("Description saved.");
      } else toast.error(result.error);
    });
  }

  function remove() {
    if (!window.confirm("Delete this image? Anywhere it's used on the site will show no image until you choose another.")) return;
    startTransition(async () => {
      const result = await deleteMedia(media.id);
      if (result.ok) onDeleted(media.id);
      else toast.error(result.error);
    });
  }

  return (
    <li className={cn("flex flex-col overflow-hidden rounded-xl border border-frantoio/10 bg-white", pending && "opacity-60")}>
      <div className="aspect-4/3 bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media.url} alt={alt} loading="lazy" className="size-full object-cover" />
      </div>
      <div className="flex flex-col gap-2 p-3">
        <Input
          aria-label="Image description"
          placeholder="Describe this image"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={saveAlt}
          onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
          className="h-9 text-[0.875rem]"
        />
        <div className="flex items-center gap-1 text-[0.75rem] text-frantoio/50">
          <span className="truncate">
            {media.width && media.height ? `${media.width} × ${media.height}` : ""} {size(media.size)}
          </span>
          <button
            type="button"
            onClick={() => {
              const url = new URL(media.url, window.location.origin).toString();
              navigator.clipboard.writeText(url).then(() => toast.success("Image address copied."));
            }}
            className="ml-auto flex size-8 items-center justify-center rounded-md hover:bg-frantoio/6 hover:text-frantoio"
          >
            <Copy className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Copy image address</span>
          </button>
          <button
            type="button"
            onClick={remove}
            className="flex size-8 items-center justify-center rounded-md hover:bg-pomodoro/10 hover:text-pomodoro"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Delete image</span>
          </button>
        </div>
      </div>
    </li>
  );
}

export function MediaLibrary({ initial, storage }: { initial: Media[]; storage: "blob" | "local" }) {
  const [items, setItems] = useState(initial);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setUploading((n) => n + list.length);
    for (const file of list) {
      try {
        const media = await uploadImage(file);
        setItems((current) => [media, ...current]);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed.");
      } finally {
        setUploading((n) => n - 1);
      }
    }
    toast.success(list.length === 1 ? "Image uploaded." : `${list.length} images uploaded.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-leaf bg-leaf/8" : "border-frantoio/15 bg-white/50",
        )}
      >
        <p className="font-display text-[1.375rem]">Drop images here to upload</p>
        <p className="text-[0.875rem] text-frantoio/55">
          JPG, PNG, WebP, GIF or AVIF. Large photos are resized automatically.
          {storage === "local" ? " (Saved locally: connect Vercel Blob before going live.)" : ""}
        </p>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) upload(e.target.files);
            e.target.value = "";
          }}
        />
        <Button variant="primary" onClick={() => fileRef.current?.click()} disabled={uploading > 0}>
          {uploading > 0 ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Upload className="size-4" aria-hidden="true" />}
          {uploading > 0 ? `Uploading ${uploading}…` : "Choose files"}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="py-10 text-center text-frantoio/50">No images uploaded yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {items.map((media) => (
            <MediaCard key={media.id} media={media} onDeleted={(id) => setItems((c) => c.filter((m) => m.id !== id))} />
          ))}
        </ul>
      )}
    </div>
  );
}
