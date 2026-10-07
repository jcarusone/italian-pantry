"use server";

import { redirect } from "next/navigation";

import { userHasAdminAccess } from "@/lib/auth/neon-role";

import { getAppOrigin } from "./app-origin";
import { getNeonAuth } from "./neon";
import { devSignIn, isDevLoginEnabled, signOutCurrentUser } from "./session";

/** `email` and `name` are sent back so the form keeps what was typed after an error. */
export type AuthFormState = { error?: string; notice?: string; email?: string; name?: string };

const NO_ACCESS =
  "This account doesn't have access to the admin. In the Neon console, set the user's role to admin.";

export async function signInAction(_prev: AuthFormState, form: FormData): Promise<AuthFormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password.", email };

  try {
    if (!(await userHasAdminAccess(email))) return { error: NO_ACCESS, email };
  } catch (error) {
    console.error("Neon Auth role lookup failed:", error);
    return { error: "The database isn't reachable. Check DATABASE_URL.", email };
  }

  const neon = getNeonAuth();
  if (neon) {
    const { error } = await neon.signIn.email({ email, password });
    if (error) return { error: error.message || "That email and password don't match.", email };
  } else if (isDevLoginEnabled()) {
    if (!(await devSignIn(email, password))) return { error: "That password isn't right.", email };
  } else {
    return { error: "Sign-in isn't set up yet. Add the Neon Auth settings to the environment.", email };
  }

  redirect("/admin");
}

export async function signUpAction(_prev: AuthFormState, form: FormData): Promise<AuthFormState> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!name || !email) return { error: "Enter your name and email.", email, name };
  if (password.length < 10) return { error: "Use a password of at least 10 characters.", email, name };

  const neon = getNeonAuth();
  if (!neon) return { error: "Account creation needs Neon Auth to be configured.", email, name };

  const { error } = await neon.signUp.email({ name, email, password });
  if (error) return { error: error.message || "Could not create the account.", email, name };

  // Some Neon Auth projects require email verification before the first sign-in.
  const { data } = await neon.getSession();
  if (!data?.user) {
    return {
      notice:
        "Account created. Check your inbox to verify your email, then sign in once an admin has set your role to admin in Neon.",
      email,
      name,
    };
  }

  const sessionUser = data.user as { role?: string };
  if (!(await userHasAdminAccess(email, sessionUser.role))) {
    await neon.signOut();
    return { error: NO_ACCESS, email, name };
  }
  redirect("/admin");
}

export async function signOutAction() {
  await signOutCurrentUser();
  redirect("/admin/sign-in");
}

export async function forgotPasswordAction(_prev: AuthFormState, form: FormData): Promise<AuthFormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Enter your email address.", email };

  const neon = getNeonAuth();
  if (!neon) {
    return { error: "Password reset needs Neon Auth. Configure NEON_AUTH_* or use dev sign-in.", email };
  }

  const origin = await getAppOrigin();
  try {
    const { error } = await neon.requestPasswordReset({
      email,
      redirectTo: `${origin}/admin/reset-password`,
    });
    if (error) return { error: error.message || "Could not send a reset email. Try again later.", email };
  } catch (error) {
    console.error("requestPasswordReset failed:", error);
    return {
      error: error instanceof Error ? error.message : "Could not send a reset email. Try again later.",
      email,
    };
  }

  return {
    notice: "If that email is registered, we sent a reset link. Check your inbox (and spam folder).",
    email,
  };
}

export async function resetPasswordAction(_prev: AuthFormState, form: FormData): Promise<AuthFormState> {
  const token = String(form.get("token") ?? "");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (!token) return { error: "This reset link is invalid or has expired." };
  if (password.length < 10) return { error: "Use a password of at least 10 characters." };
  if (password !== confirm) return { error: "The passwords don't match." };

  const neon = getNeonAuth();
  if (!neon) return { error: "Password reset isn't available in this environment." };

  const { error } = await neon.resetPassword({ newPassword: password, token });
  if (error) {
    return { error: error.message || "Could not reset your password. Request a new link and try again." };
  }

  redirect("/admin/sign-in?reset=success");
}
