import { CountUp } from "@/components/motion/count-up";
import { ParallaxImage } from "@/components/motion/parallax";
import { MaskLines, Reveal } from "@/components/motion/reveal";
import type { SectionContent } from "@/lib/cms/sections";
import { toLines } from "@/lib/cms/text";

/** "2,912 m" counts up to 2912 and keeps " m"; anything non-numeric is shown as written. */
function Figure({ value }: { value: string }) {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) return <>{value}</>;
  const number = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(number)) return <>{value}</>;
  return <CountUp value={number} suffix={match[2]} />;
}

export function Region({ content, id = "abruzzo" }: { content: SectionContent<"home.region">; id?: string }) {
  return (
    <section id={id} className="scroll-mt-16">
      <div className="on-dark relative h-[78svh] min-h-[32rem] text-limestone">
        {content.image.url ? (
          <ParallaxImage src={content.image.url} alt={content.image.alt} className="absolute inset-0" strength={14} />
        ) : (
          <div className="absolute inset-0 bg-frantoio" />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,24,18,0.88)_0%,rgba(28,24,18,0.15)_60%)]"
        />
        <div className="site-container relative flex h-full flex-col justify-end pb-12 md:pb-16">
          {content.eyebrow ? <p className="label text-olio">{content.eyebrow}</p> : null}
          <MaskLines
            lines={toLines(content.heading)}
            className="mt-5 font-display text-[clamp(2.5rem,6vw,5.75rem)] leading-[1]"
          />
        </div>
      </div>

      <div className="site-container grid grid-cols-1 gap-16 py-20 md:py-28 lg:grid-cols-12 lg:gap-10">
        <Reveal className="flex flex-col gap-5 text-muted-foreground lg:col-span-6">
          <p className="text-[1.1875rem] leading-relaxed text-foreground">{content.lead}</p>
          {content.body ? <p>{content.body}</p> : null}
        </Reveal>

        {content.stats.length ? (
          <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-2xl bg-frantoio/15 lg:col-span-5 lg:col-start-8">
            {content.stats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="flex flex-col-reverse justify-end gap-2 bg-limestone p-6 md:p-8">
                <dt className="text-[0.9375rem] text-muted-foreground">{stat.label}</dt>
                <dd className="font-display text-[clamp(1.875rem,3.6vw,3.25rem)] leading-none whitespace-nowrap">
                  <Figure value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {content.features.length ? (
        <div className="site-container pb-24 md:pb-36">
          <dl className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {content.features.map((feature, index) => (
              <Reveal key={`${feature.title}-${index}`} delay={index * 0.08} className="border-t border-frantoio/20 pt-6">
                <dt className="font-display text-[1.625rem] leading-tight">{feature.title}</dt>
                <dd className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">{feature.body}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
}
