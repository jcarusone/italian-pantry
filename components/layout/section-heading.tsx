import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="border-t-2 border-foreground pt-5">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          {eyebrow ? (
            <span className="eyebrow text-primary">{eyebrow}</span>
          ) : null}
          <h2 className="font-display text-4xl leading-[0.95] text-balance uppercase sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {action ? (
          <Link
            href={action.href}
            className="group inline-flex shrink-0 items-center gap-2 border-b-2 border-foreground pb-1 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase transition-colors hover:border-primary hover:text-primary"
          >
            {action.label}
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ) : null}
      </div>
    </div>
  )
}
