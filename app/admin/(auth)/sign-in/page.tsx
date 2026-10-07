import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/admin/auth-form";
import { isNeonAuthConfigured } from "@/lib/auth/neon";
import { userHasAdminAccess } from "@/lib/auth/neon-role";
import { getSignedInUser, isDevLoginEnabled } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  "not-allowed":
    "This account doesn't have access to the admin. In the Neon console, set the user's role to admin.",
};

const NOTICES: Record<string, string> = {
  success: "Your password was updated. Sign in with your new password.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const { error, reset } = await searchParams;
  const user = await getSignedInUser();
  if (user && !error && (await userHasAdminAccess(user.email, user.role).catch(() => false))) {
    redirect("/admin");
  }

  const neon = isNeonAuthConfigured();
  const dev = isDevLoginEnabled();

  return (
    <>
      <h1 className="font-display text-[2.5rem] leading-tight">Sign in</h1>
      <p className="mt-2 mb-8 text-[0.9375rem] text-frantoio/60">Welcome back to the Italian Pantry admin.</p>
      {reset && NOTICES[reset] ? (
        <p role="status" className="mb-4 rounded-lg bg-leaf/10 px-3 py-2 text-[0.875rem] text-leaf">
          {NOTICES[reset]}
        </p>
      ) : null}
      {neon || dev ? (
        <>
          <AuthForm mode="sign-in" initialError={error ? ERRORS[error] : undefined} />
          {neon ? (
            <p className="mt-4 text-right text-[0.875rem]">
              <Link href="/admin/forgot-password" className="font-semibold text-frantoio/70 underline underline-offset-4 hover:text-frantoio">
                Forgot password?
              </Link>
            </p>
          ) : null}
        </>
      ) : (
        <p className="rounded-lg bg-pomodoro/8 p-4 text-[0.9375rem] text-pomodoro">
          Sign-in isn&apos;t configured yet. Add NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET to the environment.
        </p>
      )}
      {dev ? (
        <p className="mt-6 rounded-lg bg-olio/20 p-3 text-[0.8125rem] text-[#6d5413]">
          Local development login: use an email with role admin in neon_auth.user and ADMIN_DEV_PASSWORD.
        </p>
      ) : null}
      {neon ? (
        <p className="mt-8 text-[0.875rem] text-frantoio/60">
          First time here?{" "}
          <Link href="/admin/sign-up" className="font-semibold text-frantoio underline underline-offset-4">
            Create your account
          </Link>
        </p>
      ) : null}
    </>
  );
}
