import { NextResponse, type NextRequest } from "next/server";

import { createNeonAuth } from "@neondatabase/auth/next/server";

/**
 * Keeps Neon Auth sessions fresh on admin pages and sends signed-out visitors to the
 * sign-in page. Public auth routes (sign-in, sign-up, forgot/reset password) are excluded
 * from the matcher. Admin access is enforced in layouts and server actions.
 */
const neon =
  process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET
    ? createNeonAuth({
        baseUrl: process.env.NEON_AUTH_BASE_URL,
        cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET },
      }).middleware({ loginUrl: "/admin/sign-in" })
    : null;

export default async function proxy(request: NextRequest) {
  if (!neon) return NextResponse.next();
  return neon(request);
}

export const config = {
  // Public admin auth routes must stay out of session middleware (forgot / reset password).
  matcher: ["/admin", "/admin/((?!sign-in|sign-up|forgot-password|reset-password).*)"],
};
