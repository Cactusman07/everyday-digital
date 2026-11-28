import type { NextConfig } from "next";
import { SITE } from "./lib/site";
import { CMS_MEDIA_ORIGINS, CMS_UPLOADS_PATH } from "./lib/wordpress/images";

// Baseline security headers for every response. (A full Content Security
// Policy would also need to allow Formspree, Vercel Analytics and the inline
// JSON-LD scripts, so it's left for a separate, tested change.)
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Production is also reachable at everyday-digital.vercel.app, which search
  // engines can index as a copy of the site. Send it to the real domain.
  // The API stays reachable there, and preview deployments are unaffected.
  async redirects() {
    if (process.env.VERCEL_ENV !== "production") return [];
    return [
      {
        source: "/:path((?!api/).*)",
        has: [{ type: "host", value: String.raw`.*\.vercel\.app` }],
        destination: `${SITE.url}/:path`,
        permanent: true,
      },
    ];
  },
  images: {
    // next/image may optimise WordPress uploads from these origins only.
    remotePatterns: CMS_MEDIA_ORIGINS.map((o) => ({
      ...o,
      pathname: CMS_UPLOADS_PATH,
    })),
  },
};

export default nextConfig;
