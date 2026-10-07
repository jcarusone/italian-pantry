"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { MaskLines } from "@/components/motion/reveal";
import { PillLink } from "@/components/ui/pill";
import { toLines } from "@/lib/cms/text";
import type { SectionContent } from "@/lib/cms/sections";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({
  content,
  underHeader = true,
}: {
  content: SectionContent<"home.hero">;
  /** True when the hero opens the page and sits under the transparent header. */
  underHeader?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      data-dark-hero={underHeader ? "" : undefined}
      className={`on-dark relative isolate ${underHeader ? "-mt-(--nav-h)" : ""} flex min-h-svh flex-col overflow-hidden bg-frantoio text-limestone md:h-svh md:min-h-[44rem]`}
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0 -z-20">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.14, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: EASE }}
        >
          <Image
            src={content.image.url || "/product-line/img-22.webp"}
            alt={content.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center] md:object-center"
          />
        </motion.div>
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(28,24,18,0.94)_0%,rgba(28,24,18,0.7)_42%,rgba(28,24,18,0)_72%),linear-gradient(0deg,rgba(28,24,18,0.95)_0%,rgba(28,24,18,0)_45%)] max-md:bg-[linear-gradient(0deg,rgba(28,24,18,0.97)_30%,rgba(28,24,18,0.72)_62%,rgba(28,24,18,0.35)_100%)]"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="site-container flex flex-1 flex-col justify-end pt-[calc(var(--nav-h)+3rem)] pb-10 md:pb-14"
      >
        <motion.p
          className="label text-olio font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {content.eyebrow}
        </motion.p>

        <MaskLines
          as="h1"
          immediate
          delay={0.35}
          lines={toLines(content.heading)}
          className="mt-5 font-display text-[clamp(3rem,5.8vw,6.25rem)] leading-[0.98] tracking-[-0.02em]"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: EASE }}
          className="mt-8 flex max-w-[40rem] flex-col gap-8"
        >
          <p className="max-w-[34rem] text-[1.0625rem] leading-relaxed text-limestone/75">
            {content.body}
          </p>
          <div className="flex flex-wrap gap-3">
            {content.primaryCta.label ? (
              <PillLink href={content.primaryCta.href} variant="olio">
                {content.primaryCta.label}
              </PillLink>
            ) : null}
            {content.secondaryCta.label ? (
              <PillLink href={content.secondaryCta.href} variant="ghostLight">
                {content.secondaryCta.label}
              </PillLink>
            ) : null}
          </div>
        </motion.div>

        <div className="relative mt-12 md:mt-16">
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left bg-limestone/25"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, delay: 1.2, ease: EASE }}
          />
          <dl className="grid grid-cols-2 gap-y-6 pt-6 md:grid-cols-4">
            {content.facts.map((fact, index) => (
              <motion.div
                key={`${fact.label}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.35 + index * 0.08, ease: EASE }}
                className="flex flex-col gap-1"
              >
                <dt className="text-[0.8125rem] text-limestone/55">{fact.label}</dt>
                <dd className="font-display text-[1.5rem] leading-tight md:text-[1.75rem]">
                  {fact.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </motion.div>
    </section>
  );
}
