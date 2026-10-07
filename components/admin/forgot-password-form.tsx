"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { forgotPasswordAction, type AuthFormState } from "@/lib/auth/actions";

import { Button, Field, Input } from "./ui";

export function ForgotPasswordForm({ initialError }: { initialError?: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(forgotPasswordAction, {
    error: initialError,
  });

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.email} />
      </Field>
      {state.error ? (
        <p role="alert" className="rounded-lg bg-pomodoro/8 px-3 py-2 text-[0.875rem] text-pomodoro">
          {state.error}
        </p>
      ) : null}
      {state.notice ? (
        <p role="status" className="rounded-lg bg-leaf/10 px-3 py-2 text-[0.875rem] text-leaf">
          {state.notice}
        </p>
      ) : null}
      <Button type="submit" variant="primary" disabled={pending} className="mt-2 h-11">
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        Send reset link
      </Button>
    </form>
  );
}
