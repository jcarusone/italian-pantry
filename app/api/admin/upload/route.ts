import { NextResponse } from "next/server";

import { userHasAdminAccess } from "@/lib/auth/neon-role";
import { getSignedInUser } from "@/lib/auth/session";
import { getDb, schema } from "@/lib/db";
import { storeFile } from "@/lib/storage";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_BYTES = 4 * 1024 * 1024; // Vercel functions accept bodies up to 4.5 MB.

export async function POST(request: Request) {
  const user = await getSignedInUser();
  if (!user || !(await userHasAdminAccess(user.email, user.role))) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was received." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Use a JPG, PNG, WebP, GIF or AVIF image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "This image is larger than 4 MB. Resize it and try again." }, { status: 400 });
  }

  const toInt = (value: FormDataEntryValue | null) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
  };

  try {
    const stored = await storeFile(file);
    const [row] = await getDb()
      .insert(schema.media)
      .values({
        url: stored.url,
        pathname: stored.pathname,
        alt: String(form.get("alt") ?? "").slice(0, 500),
        width: toInt(form.get("width")),
        height: toInt(form.get("height")),
        size: file.size,
        contentType: file.type,
      })
      .returning();
    return NextResponse.json({ media: row });
  } catch (error) {
    console.error("Upload failed:", error);
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
