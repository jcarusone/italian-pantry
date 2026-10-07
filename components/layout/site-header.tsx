"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

import { useCart } from "@/components/cart/cart-provider";
import { Logo } from "@/components/layout/logo";
import type { NavLink } from "@/lib/cms/defaults-nav";
import { cn } from "@/lib/utils";


function isLinkActive(href: string, pathname: string) {
  if (href.includes("#")) return false;
  if (href === pathname) return true;
  return href !== "/" && pathname.startsWith(`${href}/`);
}

export function SiteHeader({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const { totalQuantity, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Distance travelled upward since the visitor last scrolled down.
  const upTravel = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? latest;
    const delta = latest - previous;
    setAtTop(latest < 60);

    if (latest < 120) {
      // Always visible near the top of the page.
      upTravel.current = 0;
      setHidden(false);
    } else if (delta > 0) {
      // Any downward movement, however slow, keeps the bar hidden.
      upTravel.current = 0;
      setHidden(true);
    } else if (delta < 0) {
      // Only a deliberate scroll up (not a tiny bounce) brings it back.
      upTravel.current += -delta;
      if (upTravel.current > 24) setHidden(false);
    }
  });

  // Pages that open on a full-bleed dark image mark it with data-dark-hero,
  // so the bar starts transparent over it.
  const [darkHero, setDarkHero] = useState(() => pathname === "/" || pathname === "/about");
  useEffect(() => {
    setMobileOpen(false);
    setDarkHero(Boolean(document.querySelector("[data-dark-hero]")));
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const overDarkHero = darkHero && atTop && !mobileOpen;

  return (
    <>
      <motion.header
        animate={{ y: hidden && !mobileOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "sticky top-0 z-40 h-(--nav-h) transition-[background-color,color,border-color,backdrop-filter] duration-500",
          overDarkHero
            ? "border-b border-transparent bg-transparent text-limestone"
            : mobileOpen
              ? "border-b border-transparent bg-frantoio text-limestone"
              : "border-b border-border/70 bg-limestone/85 text-frantoio backdrop-blur-xl",
        )}
      >
        <div className="site-container flex h-full items-center gap-6">
          <Link href="/" className="relative mr-auto flex items-center" aria-label="Italian Pantry home">
            <Logo
              variant={overDarkHero || mobileOpen ? "light" : "dark"}
              priority
              className="h-9 w-auto md:h-11"
            />
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
            {links.map((link) => {
              const active = isLinkActive(link.href, pathname);
              return (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target={link.newTab ? "_blank" : undefined}
                  rel={link.newTab ? "noopener noreferrer" : undefined}
                  aria-current={active ? "page" : undefined}
                  className="group relative py-2 text-[0.9375rem] font-medium"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-(--ease-pour)",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 lg:ml-4">
            <button
              type="button"
              onClick={openCart}
              className={cn(
                "flex h-10 items-center gap-2.5 rounded-full border pr-1.5 pl-4 text-[0.9375rem] font-medium transition-colors duration-300",
                overDarkHero || mobileOpen
                  ? "border-limestone/35 hover:bg-limestone hover:text-frantoio"
                  : "border-frantoio/20 hover:bg-frantoio hover:text-limestone",
              )}
            >
              Cart
              <span className="flex size-7 items-center justify-center rounded-full bg-olio text-xs font-semibold text-frantoio tabular-nums">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={totalQuantity}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {totalQuantity}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="sr-only">
                , {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="flex h-10 items-center rounded-full px-3 text-[0.9375rem] font-medium lg:hidden"
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="on-dark fixed inset-x-0 top-(--nav-h) bottom-0 z-30 overflow-y-auto bg-frantoio text-limestone lg:hidden"
            data-lenis-prevent
          >
            <ul className="site-container flex flex-col pt-6 pb-16">
              {links.map((link, index) => (
                <motion.li
                  key={`${link.label}-${link.href}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-limestone/12"
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-5 font-display text-4xl"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
