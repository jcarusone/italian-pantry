/** Fixed site constants. Everything editable lives in the admin (see lib/cms/sections.ts). */
export const SITE = {
  name: "Italian Pantry",
  domain: "italianpantry.ca",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.italianpantry.ca",
} as const;
