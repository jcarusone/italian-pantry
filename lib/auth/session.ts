import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { NEON_AUTH_ADMIN_ROLE, userHasAdminAccess } from "@/lib/auth/neon-role";

import { getNeonAuth, isNeonAuthConfigured } from "./neon";

export type SignedInUser = { email: string; name: string; role?: string | null };
export type AdminSession = SignedInUser & { role: typeof NEON_AUTH_ADMIN_ROLE };

/* -------------------------------------------------------------------------- */
/*  Local development login                                                    */
/*  Only active when Neon Auth is NOT configured and ADMIN_DEV_PASSWORD is set. */
/*  Never set ADMIN_DEV_PASSWORD in production.                                */
/* -------------------------------------------------------------------------- */

const DEV_COOKIE = "ip_admin_dev";

export function isDevLoginEnabled() {
  return !isNeonAuthConfigured() && Boolean(process.env.ADMIN_DEV_PASSWORD);
}

function devSign(email: string) {
  return createHmac("sha256", `dev-login:${process.env.ADMIN_DEV_PASSWORD}`).update(email).digest("hex");
}

export async function devSignIn(email: string, password: string) {
  const expected = Buffer.from(process.env.ADMIN_DEV_PASSWORD ?? "");
  const given = Buffer.from(password);
  if (expected.length === 0 || expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return false;
  }
  if (!(await userHasAdminAccess(email))) return false;
  const store = await cookies();
  store.set(DEV_COOKIE, `${email}|${devSign(email)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.ADMIN_DEV_INSECURE_COOKIE !== "true",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return true;
}

async function devUser(): Promise<SignedInUser | null> {
  const value = (await cookies()).get(DEV_COOKIE)?.value;
  if (!value) return null;
  const [email, signature] = value.split("|");
  if (!email || !signature || signature !== devSign(email)) return null;
  if (!(await userHasAdminAccess(email))) return null;
  return { email, name: email.split("@")[0], role: NEON_AUTH_ADMIN_ROLE };
}

/* -------------------------------------------------------------------------- */
/*  Session                                                                    */
/* -------------------------------------------------------------------------- */

export async function getSignedInUser(): Promise<SignedInUser | null> {
  const neon = getNeonAuth();
  if (neon) {
    try {
      const { data } = await neon.getSession();
      const user = data?.user as { email?: string; name?: string; role?: string } | undefined;
      if (!user?.email) return null;
      return {
        email: user.email.toLowerCase(),
        name: user.name ?? "",
        role: user.role ?? null,
      };
    } catch (error) {
      console.error("Neon Auth session lookup failed:", error);
      return null;
    }
  }
  if (isDevLoginEnabled()) return devUser();
  return null;
}

export async function signOutCurrentUser() {
  const neon = getNeonAuth();
  if (neon) {
    await neon.signOut();
  }
  (await cookies()).delete(DEV_COOKIE);
}

/* -------------------------------------------------------------------------- */
/*  Admin access (`neon_auth.user.role` must be `admin`)                       */
/* -------------------------------------------------------------------------- */

/** Use at the top of every admin page and action. */
export async function requireAdmin(): Promise<AdminSession> {
  const user = await getSignedInUser();
  if (!user) redirect("/admin/sign-in");
  if (!(await userHasAdminAccess(user.email, user.role))) {
    redirect("/admin/sign-in?error=not-allowed");
  }
  return { ...user, role: NEON_AUTH_ADMIN_ROLE };
}
