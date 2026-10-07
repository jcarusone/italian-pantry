import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";

type NeonAuthInstance = ReturnType<typeof createNeonAuth>;

const globalForAuth = globalThis as unknown as { neonAuth?: NeonAuthInstance | null };

export function isNeonAuthConfigured() {
  return Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET);
}

/** The Neon Auth instance, or null when the environment isn't configured. */
export function getNeonAuth(): NeonAuthInstance | null {
  if (globalForAuth.neonAuth === undefined) {
    globalForAuth.neonAuth = isNeonAuthConfigured()
      ? createNeonAuth({
          baseUrl: process.env.NEON_AUTH_BASE_URL!,
          cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
        })
      : null;
  }
  return globalForAuth.neonAuth;
}
