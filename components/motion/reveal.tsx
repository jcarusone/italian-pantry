"use client";

import { motion, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

/**
 * Headline lines that rise out of a mask as they enter the viewport.
 * Pass each visual line separately so the break points are designed, not accidental.
 */
export function MaskLines({
  lines,
  as = "h2",
  className,
  lineClassName,
  delay = 0,
  immediate = false,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Animate on mount instead of on scroll (used in the hero). */
  immediate?: boolean;
}) {
  // The trigger lives on the heading, not on the masked spans: a span pushed out of
  // its overflow-hidden mask never intersects the viewport, so it would never fire.
  const Tag = MOTION_TAGS[as];
  const trigger = immediate
    ? { animate: "shown" }
    : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -12% 0px" } };

  return (
    <Tag className={className} initial="hidden" {...trigger}>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          aria-hidden="true"
          className={cn("block overflow-hidden pb-[0.08em] -mb-[0.08em]", lineClassName)}
        >
          <motion.span
            className="block will-change-transform"
            variants={{ hidden: { y: "108%" }, shown: { y: "0%" } }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + index * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** A quiet fade-and-settle for supporting copy. Use sparingly. */
export function Reveal({
  className,
  delay = 0,
  y = 18,
  children,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Image that is uncovered from the bottom edge, like a label being pulled into view. */
export function ClipReveal({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
