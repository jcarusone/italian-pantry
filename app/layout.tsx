import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/sonner";
import { fetchCart } from "@/lib/shopify/cart-actions";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Italian Pantry — 100% Italian Extra Virgin Olive Oil",
    template: "%s · Italian Pantry",
  },
  description:
    "Single-estate extra virgin olive oil pressed from 100% Italian olives in Tuscany, Puglia, Umbria and Sicily. Every bottle carries a harvest date and a named cultivar.",
  generator: "v0.app",
  keywords: [
    "Italian olive oil",
    "extra virgin olive oil",
    "single estate olive oil",
    "Tuscan olive oil",
    "DOP olive oil",
    "Italian pantry",
  ],
  openGraph: {
    title: "Italian Pantry — 100% Italian Extra Virgin Olive Oil",
    description:
      "Single-estate extra virgin olive oil pressed from 100% Italian olives. Harvest dated, cold extracted, shipped from Brooklyn.",
    type: "website",
    siteName: "Italian Pantry",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f5f1e8",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cart = await fetchCart();

  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="min-h-dvh bg-background antialiased">
        <CartProvider initialCart={cart}>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <CartDrawer />
        </CartProvider>
        <Toaster position="bottom-right" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
