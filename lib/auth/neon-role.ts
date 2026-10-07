import "server-only";

import { sql } from "drizzle-orm";

import { getDb, hasDatabase, neonAuthUser } from "@/lib/db";

/** Role value on `neon_auth.user` for users who may use `/admin`. */
export const NEON_AUTH_ADMIN_ROLE = "admin";

export function isNeonAuthAdmin(role: string | null | undefined): boolean {
  return role === NEON_AUTH_ADMIN_ROLE;
}

/** Load role from `neon_auth.user` (case-insensitive email match). */
export async function getNeonAuthRoleByEmail(email: string): Promise<string | null> {
  if (!hasDatabase()) return null;
  const normalized = email.trim().toLowerCase();
  const [row] = await getDb()
    .select({ role: neonAuthUser.role })
    .from(neonAuthUser)
    .where(sql`lower(${neonAuthUser.email}) = ${normalized}`)
    .limit(1);
  return row?.role ?? null;
}

export async function userHasAdminAccess(
  email: string,
  sessionRole?: string | null,
): Promise<boolean> {
  if (isNeonAuthAdmin(sessionRole)) return true;
  const role = await getNeonAuthRoleByEmail(email);
  return isNeonAuthAdmin(role);
}
