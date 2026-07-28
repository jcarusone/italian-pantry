"use server"

export type ContactState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors?: Record<string, string>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContactForm(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const topic = String(formData.get("topic") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  const fieldErrors: Record<string, string> = {}

  if (name.length < 2) fieldErrors.name = "Please tell us your name."
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Please enter a valid email address."
  if (message.length < 10) fieldErrors.message = "Please give us a little more detail."

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    }
  }

  // In production this would forward to a helpdesk, CRM, or transactional email provider.
  console.log("[v0] Contact enquiry received:", { name, email, topic })

  return {
    status: "success",
    message: `Thank you, ${name.split(" ")[0]}. We reply to every message within one working day.`,
  }
}
