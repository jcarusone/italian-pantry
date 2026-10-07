import { MaskLines } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function PageHeader({
  lines,
  intro,
  className,
  children,
}: {
  lines: string[];
  intro?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={cn("site-container pt-16 pb-12 md:pt-24 md:pb-16", className)}>
      <MaskLines
        as="h1"
        immediate
        lines={lines}
        className="font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.98] tracking-[-0.02em]"
      />
      {intro ? (
        <p className="mt-7 max-w-[38rem] text-[1.125rem] leading-relaxed text-muted-foreground text-pretty">
          {intro}
        </p>
      ) : null}
      {children}
    </header>
  );
}
