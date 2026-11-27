import type { NextConfig } from "next";

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
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // Allow next/image to optimize images served from WordPress.
    // localhost covers the local Docker container; cms.everydaydigital.co.nz
    // is the production headless backend on Cloudways.
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8181",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cms.everydaydigital.co.nz",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
