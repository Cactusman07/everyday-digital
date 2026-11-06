import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import JsonLd, {
  OrganizationJsonLd,
  ArticleJsonLd,
  ServiceJsonLd,
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
});

describe("OrganizationJsonLd", () => {
  it("renders Organization schema with correct fields", () => {
    const { container } = render(<OrganizationJsonLd />);
    const data = getJsonLdData(container);

    // Multi-typed node: LocalBusiness for local pack, Organization for brand.
    expect(data["@type"]).toEqual(
      expect.arrayContaining(["Organization", "LocalBusiness"]),
    );
    expect(data.name).toBe("Every Day Digital");
    expect(data.url).toBe("https://everydaydigital.co.nz");
    expect(data["@id"]).toBe("https://everydaydigital.co.nz/#organization");
    expect(data.address).toMatchObject({ addressLocality: "Auckland" });
    expect(data.contactPoint).toBeDefined();
  });
});

describe("ArticleJsonLd", () => {
  it("renders Article schema with required fields", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="A test"
        datePublished="2024-01-01"
        image="https://example.com/img.jpg"
        url="https://everydaydigital.co.nz/blog/test"
      />,
    );
    const data = getJsonLdData(container);

    expect(data["@type"]).toBe("Article");
    expect(data.headline).toBe("Test Article");
    expect(data.description).toBe("A test");
    expect(data.datePublished).toBe("2024-01-01");
    expect(data.image).toEqual(["https://example.com/img.jpg"]);
    expect(data.url).toBe("https://everydaydigital.co.nz/blog/test");
  });

  it("omits image array when no image provided", () => {
    const { container } = render(
      <ArticleJsonLd title="No Image" url="https://example.com/test" />,
    );
    const data = getJsonLdData(container);

    expect(data.image).toBeUndefined();
  });
});

describe("ServiceJsonLd", () => {
  it("renders Service schema with provider", () => {
    const { container } = render(
      <ServiceJsonLd
        name="Web Design"
        description="Custom websites"
        url="https://everydaydigital.co.nz/services/web-design"
      />,
    );
    const data = getJsonLdData(container);

    expect(data["@type"]).toBe("Service");
    expect(data.name).toBe("Web Design");
    // Provider references the site-wide organization node by @id.
    expect(data.provider).toEqual({
      "@id": "https://everydaydigital.co.nz/#organization",
    });
  });
});
