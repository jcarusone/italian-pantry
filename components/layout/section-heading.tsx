import Link from "next/link";

import { MaskLines } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  lines,
  description,
  action,
  className,
}: {
  /** Plain title. Use `lines` instead to control the line breaks of a large heading. */
  title?: string;
  lines?: string[];
  description?: string;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="flex max-w-3xl flex-col gap-5">
        <MaskLines
          lines={lines ?? [title ?? ""]}
          className="font-display text-[clamp(2.25rem,4.6vw,4rem)] text-balance"
        />
        {description ? (
          <p className="max-w-xl text-muted-foreground text-pretty">{description}</p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex w-fit shrink-0 items-center gap-3 text-[0.9375rem] font-semibold"
        >
          <span className="relative">
            {action.label}
            <span className="absolute inset-x-0 -bottom-1 h-px origin-right bg-current transition-transform duration-500 ease-(--ease-pour) group-hover:origin-left group-hover:scale-x-0" />
          </span>
        </Link>
      ) : null}
    </div>
  );
}
