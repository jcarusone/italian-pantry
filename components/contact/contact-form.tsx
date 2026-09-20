"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";

import { submitContactForm, type ContactState } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const INITIAL_STATE: ContactState = { status: "idle", message: "" };

const TOPICS = [
  "General enquiry",
  "Wholesale and restaurants",
  "Order or delivery",
  "Press",
] as const;

/** Lets other pages deep-link a preselected subject, e.g. /contact?topic=wholesale */
const TOPIC_SLUGS: Record<string, (typeof TOPICS)[number]> = {
  general: "General enquiry",
  wholesale: "Wholesale and restaurants",
  shipping: "Order or delivery",
  order: "Order or delivery",
  press: "Press",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="h-12 px-8 text-[0.6875rem] font-bold tracking-[0.14em] uppercase"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Sending
        </>
      ) : (
        "Send message"
      )}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, INITIAL_STATE);
  const topicParam = useSearchParams().get("topic")?.toLowerCase() ?? "";
  const presetTopic = TOPIC_SLUGS[topicParam] ?? TOPICS[0];

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start rounded-lg border-2 border-foreground bg-card p-8"
      >
        <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Check className="size-4" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-display text-2xl uppercase">
          Message received
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
          {state.message}
        </p>
      </div>
    );
  }

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
              "h-11",
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
              "h-11",
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
          className="h-11 rounded-lg border-2 border-foreground bg-transparent px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/40"
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
            "resize-none",
            state.fieldErrors?.message && "border-destructive",
          )}
        />
        {state.fieldErrors?.message ? (
          <p id="message-error" className="text-sm text-destructive">
            {state.fieldErrors.message}
          </p>
        ) : null}
      </div>

      {state.status === "error" && !state.fieldErrors ? (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
