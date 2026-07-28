"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?collection=olive-oil", label: "Olive Oil" },
  { href: "/shop?collection=pantry", label: "Pantry" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

/**
 * Nav hrefs can carry a `?collection=` filter, but `usePathname()` strips the
 * query — so a naive pathname compare marks plain "Shop" active on every
 * collection view and never highlights the collection link itself. Compare the
 * path and the collection param together.
 */
function isLinkActive(
  href: string,
  pathname: string,
  activeCollection: string | null,
) {
  const [hrefPath, hrefQuery] = href.split("?");
  const hrefCollection = new URLSearchParams(hrefQuery ?? "").get("collection");

  if (hrefPath !== pathname) {
    return hrefPath !== "/" && pathname.startsWith(`${hrefPath}/`);
  }

  return hrefCollection === activeCollection;
}

export function SiteHeader() {
  const pathname = usePathname();
  const activeCollection = useSearchParams().get("collection");
  const { totalQuantity, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Collection links share the /shop pathname, so also close on filter changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, activeCollection]);

  return (
    <header className="sticky top-0 z-40 bg-background">
      <p className="flex items-center justify-center bg-lime-700 px-4 py-1.5 text-center text-[0.685rem] font-extrabold tracking-[0.18em] text-background uppercase">
        Free shipping in the GTA on all orders over $75
      </p>

      <div className="border-b border-foreground">
        <div className="mx-auto flex h-16 w-full max-w-[100rem] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="-ml-2 flex size-9 items-center justify-center text-foreground transition-colors hover:bg-secondary lg:hidden"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
            <span className="sr-only">Toggle navigation</span>
          </button>

          <Link href="/" className="mr-auto flex items-center">
            <Logo />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(
                link.href,
                pathname,
                activeCollection,
              );

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[0.6875rem] font-semibold tracking-[0.14em] uppercase transition-colors",
                    isActive
                      ? "text-primary underline decoration-2 underline-offset-[6px]"
                      : "text-foreground hover:text-primary",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-7">
            <Link
              href="/contact"
              className="hidden h-9 items-center bg-foreground px-4 text-[0.6875rem] font-semibold tracking-[0.14em] text-background uppercase transition-colors hover:bg-primary sm:flex"
            >
              Wholesale
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative flex h-9 items-center gap-2 border border-foreground px-3 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              <span className="tabular-nums">{totalQuantity}</span>
              <span className="sr-only">
                Open bag{totalQuantity > 0 ? `, ${totalQuantity} items` : ""}
              </span>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="border-b border-foreground bg-background lg:hidden"
        >
          <ul className="mx-auto flex w-full max-w-[100rem] flex-col px-4 sm:px-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block border-b border-border py-4 text-xs font-semibold tracking-[0.14em] uppercase transition-colors last:border-b-0 hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
