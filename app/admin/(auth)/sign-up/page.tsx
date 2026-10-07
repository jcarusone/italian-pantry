import Link from "next/link";

import { AuthForm } from "@/components/admin/auth-form";
import { isNeonAuthConfigured } from "@/lib/auth/neon";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <>
      <h1 className="font-display text-[2.5rem] leading-tight">Create your account</h1>
      <p className="mt-2 mb-8 text-[0.9375rem] text-frantoio/60">
        Create your password here. You can sign in to the admin only after your Neon Auth user has role{" "}
        <strong>admin</strong> (set in the Neon console).
      </p>
      {isNeonAuthConfigured() ? (
        <AuthForm mode="sign-up" />
      ) : (
        <p className="rounded-lg bg-pomodoro/8 p-4 text-[0.9375rem] text-pomodoro">
          Accounts are created through Neon Auth, which isn&apos;t configured in this environment.
        </p>
      )}
      <p className="mt-8 text-[0.875rem] text-frantoio/60">
        Already have an account?{" "}
        <Link href="/admin/sign-in" className="font-semibold text-frantoio underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </>
  );
}
