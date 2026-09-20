import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/layout/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Italian Pantry imports single-estate extra virgin olive oil directly from eleven families across Tuscany, Puglia, Umbria and Sicily.",
};

const PRINCIPLES = [
  {
    number: "01",
    title: "One country, named groves",
    body: "Every bottle is grown and pressed in Italy on an estate we have walked. No blending across borders, no bottling-plant sleight of hand.",
  },
  {
    number: "02",
    title: "A harvest date on every label",
    body: "Olive oil is fruit juice and it does not improve with age. We print the harvest, not a two-year best-before date, and we sell through in a single season.",
  },
  {
    number: "03",
    title: "We pay before the harvest",
    body: "Growers are paid up front at a price they set. That is what makes it possible for them to pick early, accept a smaller yield, and make better oil.",
  },
  {
    number: "04",
    title: "Cold chain, dark glass",
    body: "Temperature-controlled shipping, dark glass or tin, and a warehouse that never sees direct light. Most oil is ruined after it leaves the mill.",
  },
];

const REGIONS = [
  {
    name: "Tuscany",
    detail:
      "Frantoio and Moraiolo from terraced hillsides in Chianti Classico. Pepper and green almond.",
  },
  {
    name: "Puglia",
    detail:
      "Coratina from groves with trees over five hundred years old. The most structured oil in Italy.",
  },
  {
    name: "Umbria",
    detail:
      "Blends from the hills above Spoleto. Balanced, quietly excellent, the everyday bottle.",
  },
  {
    name: "Sicily",
    detail:
      "Nocellara del Belice, plus the lemons and oranges we co-mill for our agrumato oils.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-20 sm:pb-28">
      {/* Intro */}
      <header className="border-b-2 border-foreground bg-card">
        <div className="site-container grid grid-cols-1 gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow text-muted-foreground">Our story</p>
            <h1 className="mt-4 font-display text-4xl leading-[0.95] uppercase text-balance sm:text-5xl md:text-6xl">
              Eleven families, one country, no compromises
            </h1>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground text-pretty">
              Italian Pantry began in 2016 with a single pallet of Frantoio from
              a grower outside Greve in Chianti who could not get a fair price
              from the consortium buying his fruit. We bought the lot, drove it
              to a warehouse, and sold it to restaurants in three weeks.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground text-pretty">
              Ten years later we work with eleven families across four regions.
              The model has not changed: we pay before the harvest, we take the
              whole lot, and we put the grower&apos;s name and harvest date on
              the label.
            </p>
          </div>

          <div className="relative aspect-4/5 overflow-hidden rounded-lg border-2 border-foreground bg-secondary lg:aspect-square">
            <Image
              src="/editorial/producer.png"
              alt="An Italian olive grower holding a basket of freshly picked olives"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      {/* Principles */}
      <section className="site-container py-16 sm:py-24">
        <SectionHeading
          eyebrow="How we work"
          title="Four rules we do not bend"
          description="None of this is complicated. It is simply more expensive than the alternative, and it is the entire difference in the bottle."
        />

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.number}
              className="border-t-2 border-foreground pt-6"
            >
              <span className="font-display text-3xl text-primary">
                {principle.number}
              </span>
              <h3 className="mt-3 font-display text-2xl leading-[1.0] uppercase">
                {principle.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
                {principle.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Regions */}
      <section className="border-y-2 border-foreground bg-secondary">
        <div className="site-container grid grid-cols-1 gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative aspect-4/3 overflow-hidden rounded-lg border-2 border-foreground bg-secondary">
            <Image
              src="/editorial/hero-grove.png"
              alt="Terraced olive grove on a Tuscan hillside at golden hour"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <SectionHeading
              eyebrow="Where it comes from"
              title="Four regions"
            />
            <dl className="mt-10 flex flex-col">
              {REGIONS.map((region) => (
                <div
                  key={region.name}
                  className="border-t border-foreground/25 py-5 last:border-b"
                >
                  <dt className="font-display text-xl uppercase">
                    {region.name}
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-muted-foreground text-pretty">
                    {region.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="site-container py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl leading-[1.0] uppercase text-balance sm:text-4xl">
            Taste one of ours beside whatever is in your cupboard
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground text-pretty">
            The Three Regions Tasting Set exists for exactly this. Three 250 ml
            bottles, three regions, and a scoring card. The argument makes
            itself in about ten seconds.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              render={<Link href="/products/three-regions-tasting-set" />}
              className="h-12 px-7 text-[0.6875rem] font-bold tracking-[0.14em] uppercase"
            >
              Shop the tasting set
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/contact" />}
              className="h-12 border-2 border-foreground px-7 text-[0.6875rem] font-bold tracking-[0.14em] uppercase hover:bg-accent hover:text-accent-foreground"
            >
              Talk to us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
