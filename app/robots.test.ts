import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows all user agents", () => {
    const result = robots();
    expect(result.rules).toEqual(
      expect.objectContaining({
        userAgent: "*",
        allow: "/",
      }),
    );
  });

  it("disallows WordPress admin and content paths", () => {
    const result = robots();
    expect(result.rules).toEqual(
      expect.objectContaining({
        disallow: expect.arrayContaining(["/wp-admin/", "/wp-content/"]),
      }),
    );
  });

  it("includes sitemap URL", () => {
    const result = robots();
    expect(result.sitemap).toContain("/sitemap.xml");
  });
});
