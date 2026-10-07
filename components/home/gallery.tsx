"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { PillLink } from "@/components/ui/pill";
import type { SectionContent } from "@/lib/cms/sections";
import { toLines } from "@/lib/cms/text";


/**
 * A row of kitchen photographs that travels sideways as the page scrolls down.
 */
export function Gallery({ content }: { content: SectionContent<"home.gallery"> }) {
  const images = content.images.map((item) => item.image).filter((image) => image.url);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track || reduced) {
        setDistance(0);
        return;
      }
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reduced, images.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  if (images.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      aria-label="Italian Pantry in the kitchen"
      className="on-dark relative bg-frantoio text-limestone"
      style={reduced ? undefined : { height: `calc(100svh + ${distance}px)` }}
    >
      <div
        className={
          reduced
            ? "flex flex-col justify-center py-24"
            : "sticky top-0 flex h-svh flex-col justify-center overflow-hidden py-16"
        }
      >
        <div className="site-container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02]">
            {toLines(content.heading).map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>
          {content.cta.label ? (
            <PillLink href={content.cta.href} variant="olio" className="w-fit">
              {content.cta.label}
            </PillLink>
          ) : null}
        </div>
        <motion.div
          ref={trackRef}
          style={{ x }}
          className={
            reduced
              ? "mt-12 flex gap-4 overflow-x-auto pl-5 sm:pl-8 md:gap-6 lg:pl-12"
              : "mt-12 flex w-max gap-4 pl-5 will-change-transform sm:pl-8 md:gap-6 lg:pl-12"
          }
        >
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="relative h-[50svh] shrink-0 overflow-hidden rounded-lg md:h-[52svh]"
              style={{ aspectRatio: "4 / 3" }}
            >
              <Image src={image.url} alt={image.alt} fill sizes="60vw" className="object-cover" />
            </div>
          ))}
          <div aria-hidden="true" className="w-1 shrink-0 sm:w-4 lg:w-8" />
        </motion.div>
      </div>
    </section>
  );
}
