import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => {
      if (value === undefined || value === "") return 587;
      const port = typeof value === "number" ? value : Number.parseInt(value, 10);
      return Number.isFinite(port) ? port : 587;
    }),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASSWORD: z.string().min(1).optional(),
  CONTACT_MAIL_FROM: z.string().email().optional(),
  CONTACT_MAIL_TO: z.string().email().optional(),
});

export type ContactEnv = z.infer<typeof envSchema>;

let cached: ContactEnv | null = null;

export function getContactEnv(): ContactEnv {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid contact/mail environment: ${parsed.error.message}`);
  }
  cached = parsed.data;
  return cached;
}

export function isTurnstileConfigured(): boolean {
  const env = getContactEnv();
  return Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
}

export function isContactMailConfigured(): boolean {
  const env = getContactEnv();
  return Boolean(
    env.SMTP_HOST &&
      env.SMTP_USER &&
      env.SMTP_PASSWORD &&
      env.CONTACT_MAIL_FROM &&
      env.CONTACT_MAIL_TO,
  );
}
