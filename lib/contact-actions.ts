"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { getContent } from "@/lib/cms/content";
import {
  getContactEnv,
  isContactMailConfigured,
  isTurnstileConfigured,
} from "@/lib/env/contact";
import { sendContactEnquiry } from "@/lib/mail/send-contact-enquiry";
import { verifyTurnstileToken } from "@/lib/turnstile/verify";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
  resetTurnstile?: boolean;
};

const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  topic: z.string().trim(),
  message: z.string().trim().min(10, "Please give us a little more detail."),
});

function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export async function submitContactForm(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const { name, email, topic, message } = parsed.data;
  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "").trim();
  const turnstileRequired = isTurnstileConfigured();

  if (turnstileRequired) {
    const headerStore = await headers();
    const remoteIp =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headerStore.get("x-real-ip") ??
      null;

    const verification = await verifyTurnstileToken(turnstileToken, remoteIp);
    if (!verification.ok) {
      return {
        status: "error",
        message: verification.message,
        resetTurnstile: true,
      };
    }
  } else if (process.env.NODE_ENV === "production") {
    return {
      status: "error",
      message: "The contact form is temporarily unavailable. Please email us directly.",
    };
  }

  const mailRequired = isContactMailConfigured();

  if (mailRequired) {
    const sent = await sendContactEnquiry({ name, email, topic, message });
    if (!sent.ok) {
      return {
        status: "error",
        message: sent.message,
        resetTurnstile: turnstileRequired,
      };
    }
  } else if (process.env.NODE_ENV === "production") {
    return {
      status: "error",
      message: "The contact form is temporarily unavailable. Please email us directly.",
    };
  } else {
    console.info("Contact enquiry received (mail not configured):", {
      name,
      email,
      topic,
      smtpHost: getContactEnv().SMTP_HOST ?? "(unset)",
    });
  }

  return {
    status: "success",
    message: `Thank you, ${name.split(" ")[0]}. ${(await getContent("contact")).successMessage}`,
  };
}
