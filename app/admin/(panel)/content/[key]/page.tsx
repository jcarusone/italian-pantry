import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { SectionForm } from "@/components/admin/section-form";
import { PageTitle } from "@/components/admin/ui";
import { getContent } from "@/lib/cms/content";
import { getSectionDef, type SectionKey } from "@/lib/cms/sections";

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const def = getSectionDef((await params).key);
  return { title: def?.title ?? "Content" };
}

export default async function EditSection({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const def = getSectionDef(key);
  if (!def) notFound();
  // Read straight from the database so the form always shows the latest save.
  const values = await getContent(key as SectionKey);

  return (
    <>
      <Link href="/admin/content" className="mb-6 inline-flex items-center gap-1.5 text-[0.875rem] text-frantoio/60 hover:text-frantoio">
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Page content
      </Link>
      <PageTitle title={def.title} description={def.description} />
      <SectionForm key={key} def={def} initial={values as Record<string, unknown>} />
    </>
  );
}
