import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Web app manifest — gives browsers and search engines the site name, colours
// and icons (used for "Add to home screen" and some search result displays).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Every Day",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
