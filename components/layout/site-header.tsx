"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/journal", label: "Stories" },
  { href: "/about", label: "About" },
];

function isLinkActive(href: string, pathname: string) {
  if (href === pathname) return true;
  return href !== "/" && pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { totalQuantity, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-background">
      <p className="flex items-center justify-center bg-lime-700 px-4 py-1.5 text-center text-[0.685rem] font-bold tracking-[0.1em] text-background uppercase">
        Free shipping in the GTA on all orders over $75
      </p>

      <div className="border-b border-foreground">
        <div className="site-container flex h-16 items-center gap-4">
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
              const isActive = isLinkActive(link.href, pathname);

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
              Contact us
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative flex h-9 items-center gap-2 border border-foreground px-3 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              <span className="tabular-nums">{totalQuantity}</span>
              <span className="sr-only">
                Open cart{totalQuantity > 0 ? `, ${totalQuantity} items` : ""}
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
          <ul className="site-container flex flex-col">
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
