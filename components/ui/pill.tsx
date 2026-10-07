import Link from "next/link";

import { cn } from "@/lib/utils";

const VARIANTS = {
  /** Dark bottle-glass button for light grounds. */
  dark: "bg-frantoio text-limestone before:bg-leaf",
  /** Oil-gold button, the main call to action on dark grounds. */
  olio: "bg-olio text-frantoio before:bg-limestone",
  /** Outline for dark grounds. */
  ghostLight: "border border-limestone/40 text-limestone before:bg-limestone hover:text-frantoio",
  /** Outline for light grounds. */
  ghostDark: "border border-frantoio/25 text-frantoio before:bg-frantoio hover:text-limestone",
} as const;

export type PillVariant = keyof typeof VARIANTS;

/**
 * Rounded call-to-action. On hover a fill rises from the bottom edge, like oil filling a glass.
 */
export function pillClasses(variant: PillVariant = "dark", className?: string) {
  return cn(
    "relative isolate inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-[0.875rem] font-semibold whitespace-nowrap transition-colors duration-500",
    "before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:rounded-[inherit] before:transition-transform before:duration-500 before:ease-(--ease-pour) hover:before:scale-y-100",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    className,
  );
}

export function PillLink({
  href,
  variant = "dark",
  className,
  children,
}: {
  href: string;
  variant?: PillVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={pillClasses(variant, className)}>
      {children}
    </Link>
  );
}
