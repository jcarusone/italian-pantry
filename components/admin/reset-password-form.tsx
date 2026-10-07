"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { resetPasswordAction, type AuthFormState } from "@/lib/auth/actions";

import { Button, Field, Input } from "./ui";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(resetPasswordAction, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <Field label="New password" htmlFor="password" help="At least 10 characters.">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
        />
      </Field>
      <Field label="Confirm password" htmlFor="confirm">
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
        />
      </Field>
      {state.error ? (
        <p role="alert" className="rounded-lg bg-pomodoro/8 px-3 py-2 text-[0.875rem] text-pomodoro">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" variant="primary" disabled={pending} className="mt-2 h-11">
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        Save new password
      </Button>
    </form>
  );
}
