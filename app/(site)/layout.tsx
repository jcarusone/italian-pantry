import type { Metadata } from "next";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { FooterReveal } from "@/components/layout/footer-reveal";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { getContent, getNavigation } from "@/lib/cms/content";
import { fetchCart } from "@/lib/shopify/cart-actions";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getContent("site");
  return {
    title: { default: site.seoTitle, template: "%s | Italian Pantry" },
    description: site.seoDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: site.seoTitle,
      description: site.seoDescription,
      url: SITE.url,
      type: "website",
      siteName: "Italian Pantry",
      locale: "en_CA",
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [cart, navigation, site] = await Promise.all([fetchCart(), getNavigation(), getContent("site")]);

  return (
    <SmoothScroll>
      <CartProvider initialCart={cart} freeShippingThreshold={site.freeShippingThreshold}>
        <FooterReveal footer={<SiteFooter columns={navigation.footer} site={site} />}>
          {site.announcement ? (
            <p className="bg-accent px-5 py-1 text-center tracking-wider text-[0.78rem] uppercase text-accent-foreground font-bold">
              {site.announcement}
            </p>
          ) : null}
          <SiteHeader links={navigation.header} />
          <main className="flex-1 border-b-6 border-accent shadow-[1px_1px_100px_rgba(0,0,0,1)]">{children}</main>
        </FooterReveal>
        <CartDrawer />
      </CartProvider>
    </SmoothScroll>
  );
}
