import Link from "next/link";

import { ResetPasswordForm } from "@/components/admin/reset-password-form";
import { isNeonAuthConfigured } from "@/lib/auth/neon";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;
  const neon = isNeonAuthConfigured();
  const invalid = error === "INVALID_TOKEN" || !token;

  return (
    <>
      <h1 className="font-display text-[2.5rem] leading-tight">Reset password</h1>
      <p className="mt-2 mb-8 text-[0.9375rem] text-frantoio/60">Choose a new password for your admin account.</p>
      {!neon ? (
        <p className="rounded-lg bg-pomodoro/8 p-4 text-[0.9375rem] text-pomodoro">
          Password reset requires Neon Auth to be configured.
        </p>
      ) : invalid ? (
        <div className="flex flex-col gap-4">
          <p role="alert" className="rounded-lg bg-pomodoro/8 px-3 py-2 text-[0.875rem] text-pomodoro">
            This reset link is invalid or has expired.
          </p>
          <Link href="/admin/forgot-password" className="font-semibold text-frantoio underline underline-offset-4">
            Request a new link
          </Link>
        </div>
      ) : (
        <ResetPasswordForm token={token} />
      )}
      <p className="mt-8 text-[0.875rem] text-frantoio/60">
        <Link href="/admin/sign-in" className="font-semibold text-frantoio underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
