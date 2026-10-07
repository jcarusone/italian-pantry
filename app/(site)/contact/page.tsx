import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getContent } from "@/lib/cms/content";
import { Paragraphs, toLines } from "@/lib/cms/text";

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContent("contact");
  return { title: contact.heading, description: contact.intro };
}

export default async function ContactPage() {
  const [contact, site] = await Promise.all([getContent("contact"), getContent("site")]);

  const details = [
    { label: "Email", value: site.contactEmail, href: site.contactEmail ? `mailto:${site.contactEmail}` : undefined },
    {
      label: "Telephone",
      value: site.contactPhone,
      href: site.contactPhone ? `tel:${site.contactPhone.replace(/[^\d+]/g, "")}` : undefined,
    },
    { label: "Based in", value: site.contactLocation },
    { label: "Hours", value: site.contactHours },
  ].filter((detail) => detail.value);

  return (
    <div className="pb-24 md:pb-36">
      <PageHeader lines={toLines(contact.heading)} intro={contact.intro} />

      <div className="site-container grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Suspense>
            <ContactForm turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
          </Suspense>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <dl className="flex flex-col border-t border-frantoio/15">
            {details.map((detail) => (
              <div key={detail.label} className="border-b border-frantoio/15 py-5">
                <dt className="text-[0.875rem] text-muted-foreground">{detail.label}</dt>
                <dd className="mt-1 text-[1.0625rem] leading-snug font-medium">
                  {detail.href ? (
                    <a href={detail.href} className="transition-colors hover:text-leaf">
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {contact.faqs.length ? (
        <section id="faq" className="site-container mt-28 scroll-mt-28 md:mt-36">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <SectionHeading lines={toLines(contact.faqHeading)} />
            </div>
            <Accordion className="lg:col-span-7 lg:col-start-6">
              {contact.faqs.map((faq, index) => (
                <AccordionItem key={`${faq.question}-${index}`} value={`faq-${index}`} className="border-frantoio/15">
                  <AccordionTrigger className="py-6 text-left font-display text-[1.375rem] leading-snug font-normal hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-6 text-[1rem] leading-relaxed text-muted-foreground text-pretty">
                    <Paragraphs text={faq.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      ) : null}
    </div>
  );
}
