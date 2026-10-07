"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteStory, saveStory, type StoryInput } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

import { ImageField } from "./image-field";
import { RichTextEditor } from "./rich-text-editor";
import { Badge, Button, Card, Field, Input, Textarea, useUnsavedWarning } from "./ui";

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/** "2026-10-07T14:30" for <input type="datetime-local">, in the browser's time zone. */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type EditableStory = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverUrl: string | null;
  coverAlt: string;
  author: string;
  status: "draft" | "published";
  publishedAt: string | null;
  seoTitle: string;
  seoDescription: string;
};

export function StoryEditor({ story }: { story: EditableStory }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<StoryInput>(() => ({
    title: story.title,
    slug: story.slug,
    excerpt: story.excerpt,
    body: story.body,
    coverUrl: story.coverUrl ?? "",
    coverAlt: story.coverAlt,
    author: story.author,
    status: story.status,
    publishedAt: toLocalInput(story.publishedAt),
    seoTitle: story.seoTitle,
    seoDescription: story.seoDescription,
  }));
  const [saved, setSaved] = useState(() => JSON.stringify(form));
  const [savedStatus, setSavedStatus] = useState(story.status);
  // Keep the address in step with the title until someone edits it by hand.
  const [slugTouched, setSlugTouched] = useState(!story.slug.startsWith("untitled-"));

  const dirty = JSON.stringify(form) !== saved;
  useUnsavedWarning(dirty);

  const set = <K extends keyof StoryInput>(key: K, value: StoryInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  function save(next: Partial<StoryInput> = {}) {
    const data = { ...form, ...next };
    setForm(data);
    startTransition(async () => {
      const result = await saveStory(story.id, {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : "",
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const synced = { ...data, publishedAt: toLocalInput(result.data?.publishedAt ?? null) };
      setForm(synced);
      setSaved(JSON.stringify(synced));
      setSavedStatus(data.status);
      toast.success(
        data.status === "published"
          ? savedStatus === "draft"
            ? "Story published."
            : "Story saved. The site is updated."
          : "Draft saved.",
      );
      router.refresh();
    });
  }

  function remove() {
    if (!window.confirm(`Delete “${form.title}”? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteStory(story.id);
      if (result.ok) {
        toast.success("Story deleted.");
        router.push("/admin/stories");
      } else {
        toast.error(result.error);
      }
    });
  }

  const scheduled =
    form.status === "published" && form.publishedAt && new Date(form.publishedAt).getTime() > Date.now();

  return (
    <div className="pb-16">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link href="/admin/stories" className="inline-flex items-center gap-1.5 text-[0.875rem] text-frantoio/60 hover:text-frantoio">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          All stories
        </Link>
        <span className="ml-auto flex items-center gap-2">
          <Badge tone={savedStatus === "published" ? "green" : "amber"}>
            {savedStatus === "published" ? (scheduled ? "Scheduled" : "Published") : "Draft"}
          </Badge>
          {dirty ? <span className="text-[0.8125rem] text-frantoio/55">Unsaved changes</span> : null}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_20rem]">
        <div className="flex min-w-0 flex-col gap-5">
          <label htmlFor="story-title" className="sr-only">
            Title
          </label>
          <Textarea
            id="story-title"
            rows={1}
            value={form.title}
            onChange={(e) => {
              const title = e.target.value.replace(/\n/g, " ");
              setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) || f.slug }));
            }}
            placeholder="Story title"
            className="field-sizing-content resize-none border-transparent bg-transparent px-0 font-display text-[clamp(2rem,3.4vw,2.75rem)] leading-tight shadow-none focus:border-transparent focus:ring-0"
          />
          <Field label="Summary" help="Shown on story cards and under the title." htmlFor="story-excerpt">
            <Textarea id="story-excerpt" rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </Field>
          <RichTextEditor label="Story" value={form.body} onChange={(html) => set("body", html)} />
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-6 xl:self-start">
          <Card className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-2">
              {form.status === "draft" ? (
                <>
                  <Button variant="primary" disabled={pending} onClick={() => save({ status: "published" })}>
                    {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                    Publish
                  </Button>
                  <Button disabled={pending || !dirty} onClick={() => save()}>
                    Save draft
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" disabled={pending || !dirty} onClick={() => save()}>
                    {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                    Save changes
                  </Button>
                  <Button disabled={pending} onClick={() => save({ status: "draft" })}>
                    Unpublish
                  </Button>
                </>
              )}
              {savedStatus === "published" ? (
                <a
                  href={`/stories/${form.slug}`}
                  target="_blank"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full text-[0.875rem] font-semibold text-frantoio/75 hover:bg-frantoio/6"
                >
                  View on site
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>

            <Field label="Publish date" help="Set a future date to schedule the story." htmlFor="story-date">
              <Input
                id="story-date"
                type="datetime-local"
                value={form.publishedAt}
                onChange={(e) => set("publishedAt", e.target.value)}
              />
            </Field>
            <Field label="Author" htmlFor="story-author">
              <Input id="story-author" value={form.author} onChange={(e) => set("author", e.target.value)} />
            </Field>
            <Field label="Web address" help={`italianpantry.ca/stories/${form.slug || "…"}`} htmlFor="story-slug">
              <Input
                id="story-slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value) || e.target.value.toLowerCase());
                }}
              />
            </Field>
          </Card>

          <Card className="flex flex-col gap-3 p-4">
            <h2 className="text-[0.875rem] font-semibold">Cover image</h2>
            <ImageField
              compact
              id="story-cover"
              value={{ url: form.coverUrl, alt: form.coverAlt }}
              onChange={(image) => setForm((f) => ({ ...f, coverUrl: image.url, coverAlt: image.alt }))}
            />
          </Card>

          <details className="group rounded-2xl border border-frantoio/10 bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between p-5 text-[0.875rem] font-semibold">
              Search engines
              <span className="text-frantoio/40 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <div className="flex flex-col gap-4 px-5 pb-5">
              <Field label="Search title" help="Leave empty to use the story title." htmlFor="story-seo-title">
                <Input id="story-seo-title" value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
              </Field>
              <Field
                label="Search description"
                help={`Leave empty to use the summary. ${form.seoDescription.length}/160`}
                htmlFor="story-seo-desc"
              >
                <Textarea id="story-seo-desc" rows={3} value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
              </Field>
            </div>
          </details>

          <Button variant="danger" disabled={pending} onClick={remove} className={cn("self-start")}>
            Delete story
          </Button>
        </aside>
      </div>
    </div>
  );
}
