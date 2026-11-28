import { describe, expect, it } from "vitest";
import { PRICE_COPY } from "./pricing";
import {
  SERVICES,
  servicePriceNote,
  servicePricing,
  sortByServiceOrder,
} from "./services";

describe("sortByServiceOrder", () => {
  it("puts services in display order and unknown slugs last", () => {
    const [first, second] = SERVICES;
    const sorted = sortByServiceOrder([
      { slug: "not-a-service" },
      { slug: second.slug },
      { slug: first.slug },
    ]);
    expect(sorted.map((s) => s.slug)).toEqual([
      first.slug,
      second.slug,
      "not-a-service",
    ]);
  });
});

describe("service pricing", () => {
  it("quotes the published price where a service has one", () => {
    expect(servicePricing("hosting")).toBe("hosting");
    expect(servicePriceNote("hosting")).toBe(PRICE_COPY.hosting);
    expect(servicePriceNote("development")).toContain(PRICE_COPY.website);
  });

  it("says other services are quoted", () => {
    expect(servicePricing("automation")).toBeUndefined();
    expect(servicePriceNote("automation")).toBe(PRICE_COPY.quotedService);
  });
});
