import type { Metadata } from "next";
import Image from "next/image";

import { LabelGuide } from "@/components/home/label-guide";
import { Mission } from "@/components/home/mission";
import { Region } from "@/components/home/region";
import { Story } from "@/components/home/story";
import { Why } from "@/components/home/why";
import { MaskLines } from "@/components/motion/reveal";
import { PillLink } from "@/components/ui/pill";
import { getContent } from "@/lib/cms/content";
import { toLines } from "@/lib/cms/text";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getContent("about");
  return { title: about.heroHeading, description: about.heroBody };
}

export default async function AboutPage() {
  const [about, story, mission, region, why, labelGuide] = await Promise.all([
    getContent("about"),
    getContent("home.story"),
    getContent("home.mission"),
    getContent("home.region"),
    getContent("home.why"),
    getContent("home.labelGuide"),
  ]);

  return (
    <>
      <section
        data-dark-hero=""
        className="on-dark relative isolate -mt-(--nav-h) flex h-[86svh] min-h-[36rem] flex-col justify-end overflow-hidden bg-frantoio text-limestone"
      >
        {about.heroImage.url ? (
          <Image
            src={about.heroImage.url}
            alt={about.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
        ) : null}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(28,24,18,0.95)_5%,rgba(28,24,18,0.45)_55%,rgba(28,24,18,0.75)_100%)]"
        />
        <div className="site-container pb-14 md:pb-20">
          <MaskLines
            as="h1"
            immediate
            delay={0.2}
            lines={toLines(about.heroHeading)}
            className="font-display text-[clamp(3.25rem,9vw,8.5rem)] leading-[0.95]"
          />
          <p className="mt-6 max-w-[36rem] text-[1.125rem] leading-relaxed text-limestone/80">{about.heroBody}</p>
        </div>
      </section>

      <Story content={story} />
      <Mission content={mission} />
      <Region content={region} />
      <Why content={why} />
      <LabelGuide content={labelGuide} />

      <section className="bg-secondary py-24 md:py-32">
        <div className="site-container flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <MaskLines
            lines={toLines(about.closingHeading)}
            className="font-display text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02]"
          />
          <div className="flex flex-wrap gap-3">
            {about.closingPrimary.label ? (
              <PillLink href={about.closingPrimary.href} variant="dark">
                {about.closingPrimary.label}
              </PillLink>
            ) : null}
            {about.closingSecondary.label ? (
              <PillLink href={about.closingSecondary.href} variant="ghostDark">
                {about.closingSecondary.label}
              </PillLink>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
