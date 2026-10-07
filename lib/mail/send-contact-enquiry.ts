import "server-only";

import nodemailer from "nodemailer";

import { getContactEnv } from "@/lib/env/contact";

export type ContactEnquiry = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export async function sendContactEnquiry(
  enquiry: ContactEnquiry,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const env = getContactEnv();

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_MAIL_FROM, CONTACT_MAIL_TO } = env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !CONTACT_MAIL_FROM || !CONTACT_MAIL_TO) {
    return { ok: false, message: "Email delivery is not configured." };
  }

  const subject = enquiry.topic
    ? `Contact: ${enquiry.topic} — ${enquiry.name}`
    : `Contact form — ${enquiry.name}`;

  const text = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Topic: ${enquiry.topic || "—"}`,
    "",
    enquiry.message,
  ].join("\n");

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(enquiry.name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(enquiry.email)}">${escapeHtml(enquiry.email)}</a></p>
    <p><strong>Topic:</strong> ${escapeHtml(enquiry.topic || "—")}</p>
    <hr />
    <p>${escapeHtml(enquiry.message).replace(/\n/g, "<br />")}</p>
  `.trim();

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });

    await transport.sendMail({
      from: CONTACT_MAIL_FROM,
      to: CONTACT_MAIL_TO,
      replyTo: enquiry.email,
      subject,
      text,
      html,
    });

    return { ok: true };
  } catch {
    return { ok: false, message: "We could not send your message. Please try again later." };
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
