import { Analytics } from "@vercel/analytics/next";
import type { Viewport } from "next";

import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource-variable/manrope/wght.css";

import { Toaster } from "@/components/ui/sonner";
import { SITE } from "@/lib/site";

import "./globals.css";

export const metadata = {
  metadataBase: new URL(SITE.url),
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/favicon-180x180.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1c1812",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" data-scroll-behavior="smooth" className="bg-frantoio">
      <body className="min-h-dvh antialiased">
        {children}
        <Toaster position="bottom-right" />
        {process.env.NODE_ENV === "production" && process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
