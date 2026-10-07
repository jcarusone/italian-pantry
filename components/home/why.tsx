import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import type { SectionContent } from "@/lib/cms/sections";
import { toLines } from "@/lib/cms/text";

export function Why({ content }: { content: SectionContent<"home.why"> }) {
  return (
    <section id="standards" className="scroll-mt-24 py-24 md:py-36">
      <div className="site-container">
        <SectionHeading lines={toLines(content.heading)} />
        <dl className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {content.reasons.map((reason, index) => (
            <Reveal key={`${reason.title}-${index}`} delay={(index % 3) * 0.08} className="border-t border-frantoio/20 pt-6">
              <dt className="font-display text-[1.75rem] leading-[1.1]">{reason.title}</dt>
              <dd className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">{reason.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
