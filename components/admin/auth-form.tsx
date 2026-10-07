"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { signInAction, signUpAction, type AuthFormState } from "@/lib/auth/actions";

import { Button, Field, Input } from "./ui";

export function AuthForm({ mode, initialError }: { mode: "sign-in" | "sign-up"; initialError?: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    mode === "sign-in" ? signInAction : signUpAction,
    { error: initialError },
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      {mode === "sign-up" ? (
        <Field label="Your name" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" required defaultValue={state.name} />
        </Field>
      ) : null}
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.email} />
      </Field>
      <Field
        label="Password"
        htmlFor="password"
        help={mode === "sign-up" ? "At least 10 characters." : undefined}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          minLength={mode === "sign-up" ? 10 : undefined}
          required
        />
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
        {mode === "sign-in" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
}
