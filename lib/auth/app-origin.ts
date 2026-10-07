import "server-only";

import { headers } from "next/headers";

import { SITE } from "@/lib/site";

/** Origin for auth redirects (reset password). Prefer the incoming request over SITE.url. */
export async function getAppOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host")?.split(",")[0]?.trim() ?? h.get("host")?.trim();
  if (host) {
    const forwarded = h.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const proto = forwarded ?? (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return SITE.url.replace(/\/$/, "");
}
