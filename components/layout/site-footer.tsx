import Link from "next/link";

import { Logo } from "@/components/layout/logo";

const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/shop?collection=olive-oil", label: "Olive oil" },
      { href: "/shop?collection=pantry", label: "Pantry" },
      { href: "/shop?collection=gifts", label: "Gifts" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/journal", label: "The Journal" },
      { href: "/journal/how-to-taste-olive-oil", label: "How to taste oil" },
      { href: "/journal/reading-an-olive-oil-label", label: "Reading a label" },
      { href: "/about", label: "Our story" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/contact", label: "Contact us" },
      { href: "/contact?topic=shipping", label: "Shipping & returns" },
      { href: "/contact?topic=wholesale", label: "Wholesale & trade" },
      { href: "/cart", label: "Your bag" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-foreground bg-foreground text-background">
      <div className="mx-auto w-full max-w-[100rem] px-4 py-16 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="flex max-w-sm flex-col gap-5">
            <Logo tone="inverted" />
            <p className="text-sm leading-relaxed text-background/70">
              Authentic Italian food from small-batch artisan producers and
              family farms in Italy's Abruzzo region. Imported directly to your
              door — honest, simple, exceptional.
            </p>
            <p className="eyebrow text-background/50">
              Est. 2025 · Toronto, Canada
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-4">
                <h2 className="eyebrow text-accent">{column.heading}</h2>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
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
              </div>
            ))}
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
    </footer>
  );
}
