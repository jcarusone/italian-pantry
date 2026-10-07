import Link from "next/link";

import { ForgotPasswordForm } from "@/components/admin/forgot-password-form";
import { isNeonAuthConfigured } from "@/lib/auth/neon";

export const dynamic = "force-dynamic";
export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  const neon = isNeonAuthConfigured();

  return (
    <>
      <h1 className="font-display text-[2.5rem] leading-tight">Forgot password</h1>
      <p className="mt-2 mb-8 text-[0.9375rem] text-frantoio/60">
        Enter your email and we&apos;ll send a link to reset your password.
      </p>
      {neon ? (
        <ForgotPasswordForm />
      ) : (
        <p className="rounded-lg bg-pomodoro/8 p-4 text-[0.9375rem] text-pomodoro">
          Password reset requires Neon Auth. Add NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET to the environment.
        </p>
      )}
      <p className="mt-8 text-[0.875rem] text-frantoio/60">
        <Link href="/admin/sign-in" className="font-semibold text-frantoio underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
