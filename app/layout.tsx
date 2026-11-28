import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import NzDotMap from "@/components/layout/NzDotMap";
import { SiteJsonLd } from "@/components/seo/JsonLd";
import { HERO_GRADIENT_LAYERS } from "@/lib/brand";
import { FOUNDER, SITE } from "@/lib/site";
import { OG_LOCALE } from "@/lib/seo";

/**
 * Google Analytics 4 web stream for everydaydigital.co.nz. Loaded on
 * production only, after the page is interactive, so previews and local
 * runs aren't counted and it doesn't slow the first paint.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-LWQ4K9WKGT";
const isProduction = process.env.VERCEL_ENV === "production";

const bananaItalic = localFont({
  src: "../public/fonts/BananasItalicPersonaluse-Regula.woff2",
  display: "swap",
  variable: "--font-banana-italic",
});

const anton = localFont({
  src: "../public/fonts/Anton-Regular.woff2",
  display: "swap",
  variable: "--font-anton",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Web Design, Development & Hosting, Auckland`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: FOUNDER.name }],
  creator: FOUNDER.name,
  keywords: [
    "web design auckland",
    "wordpress developer auckland",
    "shopify developer auckland",
    "web hosting nz",
    "business automation nz",
  ],
  openGraph: { type: "website", locale: OG_LOCALE, siteName: SITE.name },
  twitter: { card: "summary_large_image" },
  verification: {
    // Search Console ownership. Public by design: it's in every page's HTML.
    google: "7CWjSwhgFoza8EjLxak3ETOlRQCk3pLxAprLvKTtYrI",
    // Bing Webmaster Tools: set its code as a Vercel env var to verify
    // without touching DNS.
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={SITE.language}
      className={`${bananaItalic.variable} ${anton.variable}`}
    >
      <body>
        {/* First stop for keyboard users: jump past the header and menu */}
        <a href="#root" className="skip-link">
          Skip to content
        </a>
        {/* Page metadata replaces the layout's `alternates`, so the feed link
            is rendered here instead; React moves it into <head>. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={SITE.name}
          href="/feed.xml"
        />
        {/* Gradient layers, cross-faded by HeroWordCycle */}
        {Array.from({ length: HERO_GRADIENT_LAYERS }, (_, i) => (
          <div key={i} id={`background${i + 1}`} className="fullpage" />
        ))}

        <SiteJsonLd />

        <NzDotMap />
        {/* Header, menu and #root come from the route group layouts */}
        {children}

        <Analytics />
        <SpeedInsights />
      </body>
      {isProduction && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
