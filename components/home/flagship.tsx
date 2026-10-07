"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { AddToCartForm } from "@/components/product/add-to-cart-form";
import { MaskLines, Reveal } from "@/components/motion/reveal";
import { pillClasses } from "@/components/ui/pill";
import type { Product } from "@/lib/shopify/types";
import type { SectionContent } from "@/lib/cms/sections";
import { Paragraphs, toLines } from "@/lib/cms/text";


/** The rhombus mark from the label, drawn in gold as the section scrolls into view. */
function LabelMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" aria-hidden="true" className={className} fill="none">
      <motion.path
        d="M60 2 118 100 60 198 2 100Z"
        stroke="currentColor"
        strokeWidth="0.6"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.path
        d="M60 30 101 100 60 170 19 100Z"
        stroke="currentColor"
        strokeWidth="0.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 2.4, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}

function Rhombus() {
  return (
    <svg viewBox="0 0 12 20" aria-hidden="true" className="mt-[0.35em] h-3 w-auto shrink-0 text-olio">
      <path d="M6 0 12 10 6 20 0 10Z" fill="currentColor" />
    </svg>
  );
}

export function Flagship({
  product,
  content,
}: {
  product: Product | null;
  content: SectionContent<"flagship">;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bottleY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const markRotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section
      id="olive-oil"
      className="on-dark scroll-mt-16 overflow-clip bg-frantoio py-24 text-limestone md:py-36"
    >
      <div ref={ref} className="site-container grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
        {/* The bottle */}
        <div className="relative lg:order-none">
          <div className="relative mx-auto flex aspect-[4/5] max-w-[34rem] items-center justify-center lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)] lg:max-h-[52rem] lg:aspect-auto">
            <motion.div style={{ rotate: markRotate }} className="absolute inset-[4%] text-olio/45">
              <LabelMark className="h-full w-full" />
            </motion.div>
            <motion.div style={{ y: bottleY }} className="relative aspect-[360/870] h-[84%]">
              <Image
                src={content.image.url || "/brand/flagship-bottle.webp"}
                alt={content.image.alt}
                fill
                sizes="(min-width: 1024px) 22vw, 50vw"
                className="rounded-t-full object-cover [mask-image:linear-gradient(180deg,#000_78%,transparent)]"
              />
            </motion.div>
          </div>
        </div>

        {/* The story of the oil */}
        <div className="flex flex-col">
          {content.label ? <p className="label text-olio">{content.label}</p> : null}
          <MaskLines
            lines={toLines(content.heading)}
            className="mt-5 font-display text-[clamp(2.75rem,5.6vw,5rem)] leading-[1]"
          />
          <p className="mt-6 text-[0.9375rem] text-limestone/60">
            {content.origin}
          </p>

          <Reveal className="mt-10">
            <p className="max-w-[36rem] text-[1.125rem] leading-relaxed text-limestone/80">
              {content.description}
            </p>
          </Reveal>

          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {content.claims.map(({ text: claim }, index) => (
              <motion.li
                key={`${claim}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-3 text-[0.9375rem] leading-snug text-limestone/85"
              >
                <Rhombus />
                {claim}
              </motion.li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl border border-limestone/12 bg-limestone/[0.04] p-6 md:p-8">
            {product ? (
              <AddToCartForm product={product} tone="dark" />
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-limestone/75">{content.fallbackNote}</p>
                {content.fallbackCta.label ? (
                  <Link href={content.fallbackCta.href} className={pillClasses("olio")}>
                    {content.fallbackCta.label}
                  </Link>
                ) : null}
              </div>
            )}
          </div>

          <div className="mt-24 md:mt-32">
            <MaskLines
              as="h3"
              lines={toLines(content.compareHeading)}
              className="font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]"
            />
            <Reveal className="mt-8 flex max-w-[36rem] flex-col gap-5 text-limestone/75 [&_strong]:text-limestone">
              <Paragraphs text={content.compareBody} />
            </Reveal>
          </div>

          <Reveal className="mt-14">
            <h4 className="font-display text-[1.625rem]">{content.highlightsTitle}</h4>
            <dl className="mt-5 border-t border-limestone/15">
              {content.highlights.map((row, index) => (
                <div
                  key={`${row.label}-${index}`}
                  className="flex items-baseline justify-between gap-6 border-b border-limestone/15 py-4"
                >
                  <dt className="text-[0.9375rem] text-limestone/70">{row.label}</dt>
                  <dd className="text-right font-semibold text-olio tabular-nums">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
