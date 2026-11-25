import type { Metadata, Viewport } from "next";
import { Caveat, Inter, Outfit } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/seo/Analytics";
import { siteConfig } from "@/data/site-config";
import { defaultOgImage } from "@/lib/seo";
import { siteSchema } from "@/lib/schema";
import "./globals.css";

// Self-hosted at build time by next/font — no request to Google from the visitor's browser.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});
// Decorative script for small notes only — not preloaded, so it never competes with the hero image.
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: "600", display: "swap", preload: false });

// Defaults only. Each page sets its own title, description, canonical and share tags via lib/seo.ts.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.defaultTitle, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [defaultOgImage],
  },
  twitter: { card: "summary_large_image", images: [defaultOgImage.url] },
  // Search Console: DNS verification is preferred; this meta tag is only emitted when a code is set.
  ...(siteConfig.integrations.googleSiteVerification && {
    verification: { google: siteConfig.integrations.googleSiteVerification },
  }),
};

export const viewport: Viewport = {
  themeColor: "#0f4c43",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${outfit.variable} ${caveat.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd data={siteSchema()} />
        <Analytics />
      </body>
    </html>
  );
}
