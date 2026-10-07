"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";

import { ContactTurnstile } from "@/components/contact/contact-turnstile";
import { submitContactForm, type ContactState } from "@/lib/contact-actions";
import { pillClasses } from "@/components/ui/pill";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const INITIAL_STATE: ContactState = { status: "idle", message: "" };

const TOPICS = [
  "General enquiry",
  "Order or delivery",
  "Products and ingredients",
  "Wholesale enquiry",
] as const;

/** Lets other pages deep-link a preselected subject, e.g. /contact?topic=wholesale */
const TOPIC_SLUGS: Record<string, (typeof TOPICS)[number]> = {
  general: "General enquiry",
  wholesale: "Wholesale enquiry",
  shipping: "Order or delivery",
  order: "Order or delivery",
  products: "Products and ingredients",
};

type ContactFormProps = {
  turnstileSiteKey?: string;
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={pillClasses("dark", "px-9")}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Sending
        </>
      ) : (
        "Send message"
      )}
    </button>
  );
}

export function ContactForm({ turnstileSiteKey }: ContactFormProps) {
  const [state, formAction] = useActionState(submitContactForm, INITIAL_STATE);
  const topicParam = useSearchParams().get("topic")?.toLowerCase() ?? "";
  const presetTopic = TOPIC_SLUGS[topicParam] ?? TOPICS[0];
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const turnstileEnabled = Boolean(turnstileSiteKey);

  useEffect(() => {
    if (state.resetTurnstile) {
      setTurnstileToken(null);
      setTurnstileKey((key) => key + 1);
    }
  }, [state.resetTurnstile, state.status, state.message]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start rounded-2xl bg-card p-8 md:p-10"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-olio text-frantoio">
          <Check className="size-4" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-display text-[2rem] leading-tight">
          Message sent
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
          {state.message}
        </p>
      </div>
    );
  }

  const submitBlocked = turnstileEnabled && !turnstileToken;

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            aria-invalid={Boolean(state.fieldErrors?.name)}
            aria-describedby={
              state.fieldErrors?.name ? "name-error" : undefined
            }
            className={cn(
              "h-12 rounded-lg bg-card px-4 text-[1rem]",
              state.fieldErrors?.name && "border-destructive",
            )}
          />
          {state.fieldErrors?.name ? (
            <p id="name-error" className="text-sm text-destructive">
              {state.fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={
              state.fieldErrors?.email ? "email-error" : undefined
            }
            className={cn(
              "h-12 rounded-lg bg-card px-4 text-[1rem]",
              state.fieldErrors?.email && "border-destructive",
            )}
          />
          {state.fieldErrors?.email ? (
            <p id="email-error" className="text-sm text-destructive">
              {state.fieldErrors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="topic">What is this about?</Label>
        <select
          id="topic"
          name="topic"
          defaultValue={presetTopic}
          className="h-12 rounded-lg border border-input bg-card px-4 text-[1rem] outline-none focus-visible:border-leaf focus-visible:ring-[3px] focus-visible:ring-ring/30"
        >
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={
            state.fieldErrors?.message ? "message-error" : undefined
          }
          className={cn(
            "resize-none rounded-lg bg-card px-4 py-3 text-[1rem]",
            state.fieldErrors?.message && "border-destructive",
          )}
        />
        {state.fieldErrors?.message ? (
          <p id="message-error" className="text-sm text-destructive">
            {state.fieldErrors.message}
          </p>
        ) : null}
      </div>

      {turnstileEnabled ? (
        <div className="flex flex-col gap-2">
          <input
            type="hidden"
            name="cf-turnstile-response"
            value={turnstileToken ?? ""}
          />
          <ContactTurnstile
            key={turnstileKey}
            siteKey={turnstileSiteKey!}
            onTokenChange={setTurnstileToken}
          />
        </div>
      ) : null}

      {state.status === "error" && !state.fieldErrors ? (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div>
        <SubmitButton disabled={submitBlocked} />
      </div>
    </form>
  );
}
