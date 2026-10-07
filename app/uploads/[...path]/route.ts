import path from "node:path";

import { readLocalFile } from "@/lib/storage";

/** Serves images uploaded in local development (production uses Vercel Blob URLs). */
const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const name = (await params).path.join("/");
  try {
    const data = await readLocalFile(name);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
