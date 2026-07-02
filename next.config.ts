import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow next/image to optimize images served from the WordPress Docker container.
    // Without this, <Image src="http://localhost:8181/wp-content/uploads/..." /> would fail.
    // In production, add your real WordPress domain here too.
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8181",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.everydaydigital.co.nz",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
