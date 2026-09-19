import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about an order, wholesale enquiries, or which oil to start with. We reply to every message within one working day.",
}

const DETAILS = [
  { icon: Mail, label: "Email", value: "ciao@italianpantry.com" },
  { icon: Phone, label: "Telephone", value: "+1 (212) 555 0184" },
  { icon: MapPin, label: "Warehouse", value: "84 Vestry Street, New York, NY 10013" },
  { icon: Clock, label: "Hours", value: "Monday to Friday, 9am – 6pm ET" },
]

const FAQS = [
  {
    question: "Which oil should I start with?",
    answer:
      "The Three Regions Tasting Set. Three 250 ml bottles from Tuscany, Puglia and Sicily with a scoring card, so you can find out what you actually like before committing to a full bottle. If you want one bottle to cook with every day, choose the Colli Umbri.",
  },
  {
    question: "How quickly do you ship?",
    answer:
      "Orders placed before 2pm ET ship the same working day from our New York warehouse. Domestic delivery is two to four working days. Shipping is free on orders over $75, and we ship in temperature-controlled packaging through the summer.",
  },
  {
    question: "How should I store the oil once it arrives?",
    answer:
      "Somewhere cool and dark, away from the stove. Light and heat are what destroy olive oil, not air. Keep the cap on, do not decant it into a clear cruet on the counter, and use it within about three months of opening.",
  },
  {
    question: "Do you sell to restaurants and retailers?",
    answer:
      "Yes. We supply around ninety restaurants and independent grocers. Wholesale pricing starts at six units and we can supply 3 L and 5 L tins for kitchen use. Choose \u201cWholesale and restaurants\u201d in the form and we will send a trade sheet.",
  },
  {
    question: "What is your returns policy?",
    answer:
      "If a bottle arrives damaged or you are not happy with the oil, tell us within thirty days and we will replace it or refund you in full. We do not ask you to ship it back \u2014 there is no point paying freight on a bottle of oil twice.",
  },
]

export default function ContactPage() {
  return (
    <div className="pb-20 sm:pb-28">
      <header className="border-b border-border bg-card">
        <div className="site-container py-14 sm:py-20">
          <p className="eyebrow text-muted-foreground">
            Contact
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[0.95] uppercase text-balance sm:text-5xl md:text-6xl">
            Get in touch
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground text-pretty">
            Questions about an order, wholesale enquiries, or simply which oil to start with. A
            person reads every message and replies within one working day.
          </p>
        </div>
      </header>

      <div className="site-container grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div>
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-8">
          <div className="rounded-sm border border-border bg-card p-6">
            <h2 className="eyebrow text-muted-foreground">
              Direct
            </h2>
            <dl className="mt-6 flex flex-col gap-5">
              {DETAILS.map((detail) => (
                <div key={detail.label} className="flex gap-3">
                  <detail.icon
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs text-muted-foreground">{detail.label}</dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-pretty">{detail.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <section className="site-container border-t border-border py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl leading-[1.0] uppercase text-balance sm:text-4xl">
          Frequently asked
        </h2>
        <Accordion className="mt-10">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left text-base leading-snug">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground text-pretty">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </div>
      </section>
    </div>
  )
}
