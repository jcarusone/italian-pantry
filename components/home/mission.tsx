import { Reveal } from "@/components/motion/reveal";
import type { SectionContent } from "@/lib/cms/sections";
import { Paragraphs } from "@/lib/cms/text";

export function Mission({ content }: { content: SectionContent<"home.mission"> }) {
  return (
    <section className="bg-secondary py-24 md:py-36">
      <div className="site-container grid grid-cols-1 gap-8 lg:grid-cols-12">
        <p className="label text-gold lg:col-span-3">{content.label}</p>
        <div className="lg:col-span-9">
          <Reveal y={28}>
            <p className="max-w-[24ch] font-display text-[clamp(1.875rem,4.2vw,3.75rem)] leading-[1.08] text-balance">
              {content.statement}
            </p>
          </Reveal>
          <Reveal className="mt-10 flex max-w-[38rem] flex-col gap-4 text-muted-foreground">
            <Paragraphs text={content.body} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
