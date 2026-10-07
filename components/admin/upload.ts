"use client";

import type { Media } from "@/lib/db/schema";

const MAX_EDGE = 2400;
const TARGET_BYTES = 3.5 * 1024 * 1024;

async function loadImage(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Shrinks very large photos in the browser before upload (longest edge 2400 px, WebP),
 * so uploads stay fast and within the hosting size limit. GIFs are sent as they are.
 */
async function prepare(file: File): Promise<{ file: File; width: number; height: number }> {
  const image = await loadImage(file);
  const { naturalWidth: w, naturalHeight: h } = image;
  const tooBig = Math.max(w, h) > MAX_EDGE || file.size > TARGET_BYTES;
  if (file.type === "image/gif" || !tooBig) return { file, width: w, height: h };

  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process the image."))), "image/webp", 0.86),
  );
  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return { file: new File([blob], name, { type: "image/webp" }), width: canvas.width, height: canvas.height };
}

export async function uploadImage(file: File, alt = ""): Promise<Media> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} isn't an image.`);
  const ready = await prepare(file);
  const body = new FormData();
  body.append("file", ready.file);
  body.append("alt", alt);
  body.append("width", String(ready.width));
  body.append("height", String(ready.height));
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const json = (await response.json().catch(() => ({}))) as { media?: Media; error?: string };
  if (!response.ok || !json.media) throw new Error(json.error ?? "Upload failed.");
  return json.media;
}
