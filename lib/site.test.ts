import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FAQ } from "./faq";
import { LANDING_PAGES } from "./landing";
import { PRICES, PRICE_COPY } from "./pricing";
import { getServiceMeta } from "./services";
import { INDEXNOW_KEY, absoluteUrl, telHref } from "./site";

describe("site helpers", () => {
  it("builds absolute URLs", () => {
    expect(absoluteUrl("/blog")).toMatch(/^https?:\/\/[^/]+\/blog$/);
    expect(absoluteUrl("https://x.nz/a")).toBe("https://x.nz/a");
  });

  it("builds tel: links", () => {
    expect(telHref("021 175 9457")).toBe("tel:0211759457");
  });

  it("serves the IndexNow key file", () => {
    const file = join(process.cwd(), "public", `${INDEXNOW_KEY}.txt`);
    expect(readFileSync(file, "utf8").trim()).toBe(INDEXNOW_KEY);
  });
});

describe("pricing", () => {
  it("publishes the three prices everywhere they are quoted", () => {
    expect(PRICES).toEqual({
      website: 1500,
      hostingMonthly: 40,
      ecommerceHostingMonthly: 50,
    });
    expect(PRICE_COPY.hosting).toContain("$40 a month");
    expect(PRICE_COPY.hosting).toContain("WooCommerce store is $50 a month");
    expect(PRICE_COPY.hostingShort).toContain("WooCommerce stores $50 a month");
    expect(FAQ.map((f) => f.a).join(" ")).toContain("$1500 + GST");
  });

  it("never prices Shopify hosting", () => {
    expect(PRICE_COPY.hosting).not.toMatch(/shopify/i);
  });

  it("points every landing page at a real service", () => {
    for (const lp of LANDING_PAGES)
      expect(getServiceMeta(lp.formService)).toBeDefined();
  });
});

describe("case studies", () => {
  it("each has a screenshot for its work tile", async () => {
    const { CASE_STUDIES, caseStudyScreenshot } =
      await import("./case-studies");
    for (const c of CASE_STUDIES) {
      const file = join(process.cwd(), "public", caseStudyScreenshot(c.slug));
      expect(() => readFileSync(file)).not.toThrow();
    }
  });
});
