import { describe, expect, it } from "vitest";
import { isCmsMediaUrl, preferCmsImage } from "./images";

describe("isCmsMediaUrl", () => {
  it("accepts media on the CMS and the local Docker WordPress", () => {
    expect(
      isCmsMediaUrl(
        "https://cms.everydaydigital.co.nz/wp-content/uploads/a.jpg",
      ),
    ).toBe(true);
    expect(
      isCmsMediaUrl("http://localhost:8181/wp-content/uploads/a.jpg"),
    ).toBe(true);
  });

  it("rejects other hosts, ports, protocols and lookalikes", () => {
    for (const url of [
      "http://cms.everydaydigital.co.nz/a.jpg",
      "https://cms.everydaydigital.co.nz:8443/a.jpg",
      "https://cms.everydaydigital.co.nz.evil.example/a.jpg",
      "http://localhost:3000/a.jpg",
      "/images/a.jpg",
      "not a url",
      undefined,
    ])
      expect(isCmsMediaUrl(url)).toBe(false);
  });
});

describe("preferCmsImage", () => {
  it("falls back when the CMS image can't be optimised", () => {
    expect(preferCmsImage("https://example.com/a.jpg", "/b.jpg")).toBe(
      "/b.jpg",
    );
    expect(preferCmsImage(undefined, "/b.jpg")).toBe("/b.jpg");
  });
});
