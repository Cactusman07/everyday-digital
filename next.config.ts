import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
