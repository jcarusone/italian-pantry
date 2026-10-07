import "server-only";

import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";

/**
 * Image storage. Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production).
 * Without it, files are kept in a local `.uploads` folder for development only.
 */
export function usesVercelBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

const LOCAL_DIR = path.join(process.cwd(), ".uploads");

function safeName(name: string) {
  const ext = path.extname(name).toLowerCase().replace(/[^a-z0-9.]/g, "") || ".bin";
  const base = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${base || "image"}${ext}`;
}

export async function storeFile(file: File): Promise<{ url: string; pathname: string }> {
  const name = safeName(file.name);
  if (usesVercelBlob()) {
    const blob = await put(`media/${name}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return { url: blob.url, pathname: blob.pathname };
  }
  if (process.env.VERCEL) {
    throw new Error("Image storage isn't connected. Add a Vercel Blob store to this project.");
  }
  const pathname = `${randomUUID().slice(0, 8)}-${name}`;
  await mkdir(LOCAL_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_DIR, pathname), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${pathname}`, pathname };
}

export async function removeFile(url: string, pathname: string) {
  if (url.startsWith("/uploads/")) {
    await unlink(path.join(LOCAL_DIR, path.basename(pathname))).catch(() => undefined);
    return;
  }
  if (usesVercelBlob() && url.includes(".blob.vercel-storage.com")) {
    await del(url);
  }
}

export async function readLocalFile(name: string) {
  return readFile(path.join(LOCAL_DIR, path.basename(name)));
}
