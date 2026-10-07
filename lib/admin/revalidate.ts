import "server-only";

import { revalidatePath, updateTag } from "next/cache";

import { CMS_TAG } from "@/lib/cms/content";

/** Make a saved change visible on the public site straight away. */
export function refreshSite() {
  updateTag(CMS_TAG);
  revalidatePath("/", "layout");
}
