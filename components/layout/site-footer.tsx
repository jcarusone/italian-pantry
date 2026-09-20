import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { getCollections } from "@/lib/shopify";
import { cn } from "@/lib/utils";

const ABOUT_LINKS = [
  { href: "/about", label: "Our story" },
  { href: "/journal", label: "Stories" },
  { href: "/contact?topic=shipping", label: "Shipping & returns" },
  { href: "/contact?topic=wholesale", label: "Wholesale & trade" },
];

const CONTACT_DETAILS = [
  {
    label: "Email",
    value: "ciao@italianpantry.com",
    href: "mailto:ciao@italianpantry.com",
  },
  {
    label: "Telephone",
    value: "+1 (416) 949 8641",
    href: "tel:+14169498646",
  },
  {
    label: "Warehouse",
    value: "Toronto, ON - Canada",
  },
];

function FooterLinkList({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <ul className="flex flex-col gap-2.5">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-sm text-background/80 transition-colors hover:text-background"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterLinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="eyebrow text-accent">{heading}</h2>
      <FooterLinkList links={links} />
    </div>
  );
}

export async function SiteFooter({ className }: { className?: string }) {
  const collections = await getCollections();

  const productLinks = [
    { href: "/products", label: "All products" },
    ...collections.map((collection) => ({
      href: `/products/${collection.handle}`,
      label: collection.title,
    })),
    { href: "/cart", label: "Your cart" },
  ];

  const splitAt = Math.ceil(productLinks.length / 2);
  const productLinksCol1 = productLinks.slice(0, splitAt);
  const productLinksCol2 = productLinks.slice(splitAt);

  return (
    <footer
      className={cn(
        "relative isolate overflow-hidden border-t-2 border-foreground text-background",
        className,
      )}
    >
      <Image
        src="/product-line/img-15.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/70"
        aria-hidden="true"
      />

      <div className="relative flex min-h-dvh flex-col justify-end">
        <div className="site-container pb-16 pt-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            <div className="flex max-w-sm shrink-0 flex-col gap-5">
              <Link href="/" className="inline-flex w-fit">
                <Logo
                  variant="footer"
                  className="h-9 w-auto sm:h-14"
                  opacity={75}
                />
              </Link>
              <p className="text-sm leading-relaxed text-background/70">
                Authentic Italian food from small-batch artisan producers and
                family farms in Italy&apos;s Abruzzo region. Imported directly
                to your door — honest, simple, exceptional.
              </p>
              <p className="eyebrow text-background/50">
                Est. 2025 · Toronto, Canada
              </p>
            </div>

            <div
              className="hidden min-w-0 flex-1 lg:block"
              aria-hidden="true"
            />

            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:flex lg:shrink-0 lg:gap-x-20 xl:gap-x-24">
              <div className="flex flex-col gap-4">
                <h2 className="eyebrow text-accent">Products</h2>
                <div className="grid grid-cols-2 gap-x-12">
                  <FooterLinkList links={productLinksCol1} />
                  <FooterLinkList links={productLinksCol2} />
                </div>
              </div>

              <FooterLinkColumn heading="About" links={ABOUT_LINKS} />

              <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
                <h2 className="eyebrow text-accent">Contact</h2>
                <ul className="flex flex-col gap-3">
                  {CONTACT_DETAILS.map((detail) => (
                    <li key={detail.label} className="flex flex-col gap-0.5">
                      <span className="text-xs text-background/50">
                        {detail.label}
                      </span>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="text-sm text-background/80 transition-colors hover:text-background"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        <span className="text-sm leading-relaxed text-background/80">
                          {detail.value}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-background/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-background/50">
              © {new Date().getFullYear()} Italian Pantry. All rights reserved.
            </p>
            <p className="text-xs text-background/50">
              Secure checkout powered by Shopify
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
