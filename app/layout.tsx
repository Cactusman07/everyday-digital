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

// next/font/local self-hosts the font, generates the correct preload tag for
// the actual file the browser will use (woff2), and applies font-display
// automatically — replacing the manual @font-face + <link rel="preload">
// that was preloading the much larger .ttf while CSS actually used .woff2.
const bananaItalic = localFont({
  src: "../public/fonts/BananasItalicPersonaluse-Regula.woff2",
  display: "swap",
  variable: "--font-banana-italic",
});

// Next.js Metadata API — this exported object sets default <head> tags for every page.
// The `title.template` means child pages can export { title: "About" } and it becomes
// "About | Every Day Digital" automatically. Child pages override; these are fallbacks.
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NZ",
    siteName: "Every Day Digital",
  },
  twitter: {
    card: "summary_large_image",
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

// Root Layout — wraps every page in the app. This is a Server Component (no "use client"),
// so we can fetch data directly with async/await. Next.js calls this once and streams the
// HTML shell, then slots in each page's content via {children}.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NZ" className={bananaItalic.variable}>
      <body>
        {/* Background gradient divs — animated by BackgroundGradients client component */}
        <div id="background1" className="fullpage" />
        <div id="background2" className="fullpage" />
        <div id="background3" className="fullpage" />
        <div id="background4" className="fullpage" />
        <div id="background5" className="fullpage" />
        <div id="background6" className="fullpage" />
        <noscript>You need to enable JavaScript to run this app.</noscript>

        {/* JSON-LD structured data for SEO — tells Google this is an Organization */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />

        {/* SVG NZ map background and hero section with nav */}
        <SvgBackground />
        {/* Nav menu is fetched from WordPress independently, in its own Suspense
            boundary, so that fetch never blocks the initial HTML shell. The
            fallback renders the same NavMenu shell (hamburger etc.) with no
            items, so there's no layout shift once the real menu streams in. */}
        <HomeHero
          menuSlot={
            <Suspense fallback={<NavMenu menu={null} />}>
              <NavMenuServer />
            </Suspense>
          }
        />

        {/* {children} is where each page's content renders.
            e.g. visiting /about renders app/[slug]/page.tsx here */}
        <div id="root">{children}</div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
