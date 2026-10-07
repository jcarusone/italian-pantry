import Image from "next/image";

import { ClipReveal, MaskLines, Reveal } from "@/components/motion/reveal";
import { ScrollFillText } from "@/components/motion/scroll-fill-text";
import type { SectionContent } from "@/lib/cms/sections";
import { Paragraphs, toLines } from "@/lib/cms/text";

export function Story({ content }: { content: SectionContent<"home.story"> }) {
  return (
    <section id="our-story" className="scroll-mt-24 py-24 md:py-36">
      <div className="site-container grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 xl:col-span-6">
          <MaskLines lines={toLines(content.heading)} className="font-display text-[clamp(2.5rem,5vw,4.5rem)]" />
          <Reveal className="mt-10 flex max-w-[36rem] flex-col gap-5 text-muted-foreground">
            <Paragraphs text={content.body} />
          </Reveal>
        </div>

        {content.image.url ? (
          <div className="lg:col-span-5 lg:col-start-8">
            <ClipReveal className="relative aspect-4/5 overflow-hidden rounded-lg lg:sticky lg:top-28">
              <Image
                src={content.image.url}
                alt={content.image.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[70%_center]"
              />
            </ClipReveal>
          </div>
        ) : null}
      </div>

      {content.quote ? (
        <figure className="site-container mt-28 md:mt-40">
          <ScrollFillText
            as="blockquote"
            text={content.quote}
            className="max-w-[22ch] font-display text-[clamp(2.25rem,5.4vw,5.25rem)] leading-[1.06] tracking-[-0.02em] md:max-w-[24ch]"
          />
          {content.quoteAttribution ? (
            <figcaption className="mt-8 text-[0.9375rem] text-muted-foreground">
              {content.quoteAttribution}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      {content.values.length ? (
        <div className="site-container mt-24 md:mt-32">
          <dl className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {content.values.map((value, index) => (
              <Reveal key={`${value.title}-${index}`} delay={index * 0.06} className="border-t border-frantoio/20 pt-6">
                <dt className="font-display text-[1.625rem] leading-tight">{value.title}</dt>
                <dd className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">{value.body}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
}
