import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import JsonLd, {
  SiteJsonLd,
  ArticleJsonLd,
  ServiceJsonLd,
  serviceOffers,
  offerCatalog,
  ORG_ID,
  FOUNDER_ID,
} from "./JsonLd";

function getJsonLdData(container: HTMLElement): Record<string, unknown> {
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script!.textContent!);
}

describe("JsonLd", () => {
  it("renders a script tag with JSON-LD data", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Thing",
      name: "Test",
    };
    const { container } = render(<JsonLd data={data} />);

    const parsed = getJsonLdData(container);
    expect(parsed).toEqual(data);
  });

  it("escapes < so content can't close the script tag", () => {
    const { container } = render(<JsonLd data={{ name: "</script>" }} />);
    const script = container.querySelector("script")!;
    expect(script.innerHTML).not.toContain("</script>");
    expect(getJsonLdData(container).name).toBe("</script>");
  });
});

describe("SiteJsonLd", () => {
  const graph = () => {
    const { container } = render(<SiteJsonLd />);
    return getJsonLdData(container)["@graph"] as Record<string, unknown>[];
  };

  it("describes the business as a local business with an address", () => {
    const org = graph().find((n) => n["@id"] === ORG_ID)!;
    expect(org["@type"]).toEqual(
      expect.arrayContaining(["Organization", "LocalBusiness"]),
    );
    expect(org.name).toBe("Every Day Digital");
    expect(org.url).toBe("https://everydaydigital.co.nz");
    expect(org.address).toMatchObject({ addressLocality: "Auckland" });
    expect(org.contactPoint).toBeDefined();
    expect(org.founder).toEqual({ "@id": FOUNDER_ID });
  });

  it("includes the founder and the website", () => {
    const types = graph().map((n) => n["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Person", "WebSite"]));
  });
});

describe("ArticleJsonLd", () => {
  it("renders BlogPosting schema with required fields", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="A test"
        datePublished="2024-01-01T00:00:00Z"
        image="https://example.com/img.jpg"
        url="https://everydaydigital.co.nz/blog/test"
      />,
    );
    const data = getJsonLdData(container);

    expect(data["@type"]).toBe("BlogPosting");
    expect(data.headline).toBe("Test Article");
    expect(data.description).toBe("A test");
    expect(data.datePublished).toBe("2024-01-01T00:00:00Z");
    expect(data.dateModified).toBe("2024-01-01T00:00:00Z");
    expect(data.image).toEqual(["https://example.com/img.jpg"]);
    expect(data.url).toBe("https://everydaydigital.co.nz/blog/test");
    expect(data.author).toMatchObject({ "@id": FOUNDER_ID, name: "Sam Muir" });
  });

  it("omits image array when no image provided", () => {
    const { container } = render(
      <ArticleJsonLd title="No Image" url="https://example.com/test" />,
    );
    expect(getJsonLdData(container).image).toBeUndefined();
  });
});

describe("ServiceJsonLd", () => {
  it("renders Service schema with provider", () => {
    const { container } = render(
      <ServiceJsonLd
        slug="development"
        name="Web Development"
        description="Custom websites"
        url="https://everydaydigital.co.nz/services/development"
      />,
    );
    const data = getJsonLdData(container);

    expect(data["@type"]).toBe("Service");
    expect(data.name).toBe("Web Development");
    expect(data.provider).toEqual({ "@id": ORG_ID });
    // No published price for this one, so no offers
    expect(data.offers).toBeUndefined();
  });

  it("publishes hosting prices per month, excluding GST", () => {
    const [website, ecommerce] = serviceOffers("hosting");
    const [monthly] = website.priceSpecification as Record<string, unknown>[];
    expect(monthly).toMatchObject({
      price: 40,
      priceCurrency: "NZD",
      valueAddedTaxIncluded: false,
    });
    expect(ecommerce.priceSpecification).toMatchObject({ price: 50 });
  });

  it("publishes the starting price for a simple website", () => {
    const [offer] = serviceOffers("website-design");
    expect(offer.priceSpecification).toMatchObject({ minPrice: 1500 });
  });
});

describe("offerCatalog", () => {
  it("lists every service, linked to the business", () => {
    const catalog = offerCatalog();
    const items = catalog.itemListElement;
    expect(items.length).toBeGreaterThanOrEqual(8);
    for (const item of items)
      expect(item.itemOffered.provider).toEqual({ "@id": ORG_ID });
  });
});
