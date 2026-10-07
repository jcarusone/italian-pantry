import "server-only";

import { getContactEnv } from "@/lib/env/contact";

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string | null,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { TURNSTILE_SECRET_KEY } = getContactEnv();

  if (!TURNSTILE_SECRET_KEY) {
    return { ok: false, message: "Verification is not configured." };
  }

  if (!token) {
    return { ok: false, message: "Please complete the security check." };
  }

  try {
    const body = new URLSearchParams({
      secret: TURNSTILE_SECRET_KEY,
      response: token,
    });
    if (remoteIp) body.set("remoteip", remoteIp);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!response.ok) {
      return { ok: false, message: "Security verification failed. Please try again." };
    }

    const data = (await response.json()) as TurnstileVerifyResponse;
    if (!data.success) {
      return { ok: false, message: "Security verification failed. Please try again." };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: "Security verification failed. Please try again." };
  }
}
