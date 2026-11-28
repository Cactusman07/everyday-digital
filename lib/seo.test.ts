import { describe, it, expect } from "vitest";
import { pageMetadata } from "./seo";

describe("pageMetadata", () => {
  it("keeps site name, locale and a default share image on every page", () => {
    const meta = pageMetadata({ title: "About", path: "/about" });
    expect(meta.alternates?.canonical).toBe("/about");
    expect(meta.openGraph).toMatchObject({
      type: "website",
      siteName: "Every Day Digital",
      locale: "en_NZ",
      url: "/about",
    });
    const images = meta.openGraph?.images as { url: string }[];
    expect(images[0].url).toBe("/opengraph-image");
  });

  it("marks posts as articles with their dates", () => {
    const meta = pageMetadata({
      title: "Post",
      path: "/blog/post",
      image: "https://cms.everydaydigital.co.nz/a.jpg",
      article: { publishedTime: "2026-01-01T00:00:00Z", tags: ["SEO"] },
    });
    expect(meta.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-01-01T00:00:00Z",
      tags: ["SEO"],
    });
  });

  it("sets noindex only when asked", () => {
    expect(pageMetadata({ title: "x", path: "/x" }).robots).toBeUndefined();
    expect(
      pageMetadata({ title: "x", path: "/lp/x", noindex: true }).robots,
    ).toEqual({ index: false, follow: false });
  });
});
