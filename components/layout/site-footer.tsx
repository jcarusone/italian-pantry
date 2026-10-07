import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import type { FooterColumn } from "@/lib/cms/defaults-nav";
import type { SectionContent } from "@/lib/cms/sections";
import { getCollections } from "@/lib/shopify";
import { SITE } from "@/lib/site";

type FooterLink = { href: string; label: string; newTab?: boolean };

const footerContactIconLink =
  "flex size-[3.25rem] items-center justify-center rounded-full border border-limestone/25 text-limestone transition-colors hover:border-limestone/50 hover:bg-limestone/5";

function Column({ heading, links }: { heading: string; links: FooterLink[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <h2 className="label text-olio font-bold">{heading}</h2>
      <ul className="flex flex-col gap-2.5">
        {links.map((link, index) => (
          <li key={`${link.href}-${index}`}>
            <Link
              href={link.href}
              target={link.newTab ? "_blank" : undefined}
              rel={link.newTab ? "noopener noreferrer" : undefined}
              className="text-[0.9175rem] text-limestone/70 transition-colors hover:text-limestone"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function SiteFooter({
  columns,
  site,
}: {
  columns: FooterColumn[];
  site: SectionContent<"site">;
}) {
  const needsCollections = columns.some((column) => column.includeCollections);
  let collections: Awaited<ReturnType<typeof getCollections>> = [];
  if (needsCollections) {
    try {
      collections = await getCollections();
    } catch (error) {
      console.error("Footer collections unavailable:", error);
    }
  }

  const resolved = columns.map((column) => ({
    title: column.title,
    links: [
      ...column.items,
      ...(column.includeCollections
        ? collections.map((c) => ({
            href: `/products/${c.handle}`,
            label: c.title,
          }))
        : []),
    ],
  }));

  const hasContact =
    site.contactEmail || site.contactPhone || site.contactLocation;

  return (
    <footer className="on-dark relative isolate flex min-h-dvh flex-col justify-end overflow-hidden bg-[#353421]/85">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/product-line/img-15.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 size-full object-cover mix-blend-multiply opacity-75"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_top,black_0%,transparent_60%)]"
      />
      <div className="site-container relative z-10 pt-12 pb-10 md:pt-14 md:pb-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.15fr_2fr] lg:gap-20">
          <div className="flex max-w-md flex-col gap-6">
            <Link href="/" className="w-fit" aria-label="Italian Pantry home">
              <Logo variant="light" className="h-14 w-auto md:h-16" />
            </Link>
            {site.footerBlurb ? (
              <p className="text-[0.9375rem] leading-relaxed text-limestone/65">
                {site.footerBlurb}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
            {resolved.map((column, index) => (
              <Column
                key={`${column.title}-${index}`}
                heading={column.title}
                links={column.links}
              />
            ))}
            {hasContact ? (
              <div className="@container flex min-w-0 flex-col gap-4">
                <h2 className="label text-olio font-bold">Get in touch</h2>
                <ul className="grid grid-cols-2 justify-items-start gap-x-2 gap-y-2.5 @min-[11rem]:grid-cols-3 sm:hidden ">
                  {site.contactEmail ? (
                    <li>
                      <a
                        href={`mailto:${site.contactEmail}`}
                        aria-label={`Email ${site.contactEmail}`}
                        className={footerContactIconLink}
                      >
                        <Mail
                          className="size-6 shrink-0"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </a>
                    </li>
                  ) : null}
                  {site.contactPhone ? (
                    <li>
                      <a
                        href={`tel:${site.contactPhone.replace(/[^\d+]/g, "")}`}
                        aria-label={`Call ${site.contactPhone}`}
                        className={footerContactIconLink}
                      >
                        <Phone
                          className="size-6 shrink-0"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </a>
                    </li>
                  ) : null}
                  {site.contactLocation ? (
                    <li>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.contactLocation)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Location: ${site.contactLocation}`}
                        className={footerContactIconLink}
                      >
                        <MapPin
                          className="size-6 shrink-0"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </a>
                    </li>
                  ) : null}
                </ul>
                <ul className="hidden min-w-0 flex-col gap-2.5 text-[0.9175rem] text-limestone/70 sm:flex">
                  {site.contactEmail ? (
                    <li className="min-w-0">
                      <a
                        href={`mailto:${site.contactEmail}`}
                        className="break-all transition-colors hover:text-limestone"
                      >
                        {site.contactEmail}
                      </a>
                    </li>
                  ) : null}
                  {site.contactPhone ? (
                    <li>
                      <a
                        href={`tel:${site.contactPhone.replace(/[^\d+]/g, "")}`}
                        className="transition-colors hover:text-limestone"
                      >
                        {site.contactPhone}
                      </a>
                    </li>
                  ) : null}
                  {site.contactLocation ? (
                    <li>{site.contactLocation}</li>
                  ) : null}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-limestone/12 pt-8 text-[0.8125rem] text-limestone/50 sm:flex-row sm:items-center sm:justify-between md:mt-16 font-bold">
          <p>
            © {new Date().getFullYear()} Italian Pantry - All Rights Reserved.
          </p>
          <p>Secure checkout by Shopify</p>
        </div>
      </div>
    </footer>
  );
}
