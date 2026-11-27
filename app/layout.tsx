import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import HomeHero from "@/components/HomeHero";
import NavMenu from "@/components/NavMenu";
import NavMenuServer from "@/components/NavMenuServer";
import SvgBackground from "@/components/SvgBackground";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://everydaydigital.co.nz",
  ),
  title: {
    default: "Every Day Digital | Web Design, Development & Hosting, Auckland",
    template: "%s | Every Day Digital",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.founder }],
  creator: SITE.founder,
  keywords: [
    "web design auckland",
    "wordpress developer auckland",
    "shopify developer auckland",
    "web hosting nz",
    "business automation nz",
  ],
  openGraph: {
    type: "website",
    locale: "en_NZ",
    siteName: "Every Day Digital",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    // Paste the codes from Google Search Console and Bing Webmaster Tools
    // into Vercel env vars to verify ownership without touching DNS.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
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
    <html lang="en-NZ" className={`${bananaItalic.variable} ${anton.variable}`}>
      <body>
        {/* Page metadata replaces the layout's `alternates`, so the feed link
            is rendered here instead; React moves it into <head>. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Every Day Digital"
          href="/feed.xml"
        />
        {/* Gradient layers, animated by BackgroundGradients */}
        <div id="background1" className="fullpage" />
        <div id="background2" className="fullpage" />
        <div id="background3" className="fullpage" />
        <div id="background4" className="fullpage" />
        <div id="background5" className="fullpage" />
        <div id="background6" className="fullpage" />

        <OrganizationJsonLd />
        <WebSiteJsonLd />

        <SvgBackground />
        {/* The menu streams in separately so its WordPress fetch never blocks
            the page; the fallback is the same button with no items. */}
        <HomeHero
          menuSlot={
            <Suspense fallback={<NavMenu menu={null} />}>
              <NavMenuServer />
            </Suspense>
          }
        />

        <div id="root">{children}</div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
