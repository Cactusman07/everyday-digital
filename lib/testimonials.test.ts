import { describe, expect, it } from "vitest";
import { isSameClient, parseTestimonial, testimonialFor } from "./testimonials";

const kerr = {
  title: "David Kerr - NZ In Pictures",
  content:
    "<p>Sam built our store. It works brilliantly!</p><p>Highly recommended.</p><p>David Kerr www.nzinpictures.co.nz</p>",
};

describe("parseTestimonial", () => {
  it("splits name, company and quote, dropping the signature", () => {
    const t = parseTestimonial(kerr);
    expect(t).toMatchObject({
      name: "David Kerr",
      company: "NZ In Pictures",
      initials: "DK",
      lead: "Sam built our store.",
      rest: "It works brilliantly! Highly recommended.",
      caseStudy: "/projects/nz-in-pictures",
    });
  });
});

describe("isSameClient", () => {
  it("ignores case, punctuation and company suffixes", () => {
    expect(isSameClient("Plow Foods Ltd", "plow foods")).toBe(true);
    expect(isSameClient("Plow Foods", "Plow Foods Limited")).toBe(true);
  });

  it("needs more than a couple of letters to match a prefix", () => {
    expect(isSameClient("NZ", "NZ In Pictures")).toBe(false);
    expect(isSameClient("Home Office Space", "Ride Rotorua Store")).toBe(false);
  });
});

describe("testimonialFor", () => {
  it("finds a client's testimonial", () => {
    expect(testimonialFor("NZ In Pictures", [kerr])?.name).toBe("David Kerr");
    expect(testimonialFor("Plow Foods", [kerr])).toBeUndefined();
  });
});
