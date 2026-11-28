import { describe, expect, it } from "vitest";
import {
  parseTestimonial,
  splitFirstSentence,
  testimonialFor,
} from "./testimonials";

const kerr = {
  title: "David Kerr - NZ In Pictures",
  content:
    "<p>Sam built our store. It works brilliantly!</p><p>Highly recommended.</p><p>David Kerr www.nzinpictures.co.nz</p>",
  projectSlug: "nz-in-pictures",
};

describe("parseTestimonial", () => {
  it("splits name, company and quote, dropping the signature", () => {
    expect(parseTestimonial(kerr)).toMatchObject({
      name: "David Kerr",
      company: "NZ In Pictures",
      initials: "DK",
      lead: "Sam built our store.",
      rest: "It works brilliantly! Highly recommended.",
    });
  });

  it("links to the project chosen in WordPress", () => {
    expect(parseTestimonial(kerr)).toMatchObject({
      projectPath: "/projects/nz-in-pictures",
      isCaseStudy: true,
      url: "https://nzinpictures.co.nz",
    });
    expect(
      parseTestimonial({ ...kerr, projectSlug: "some-other-project" }),
    ).toMatchObject({
      projectPath: "/projects/some-other-project",
      isCaseStudy: false,
    });
  });

  it("has no project link when none is chosen", () => {
    const t = parseTestimonial({ ...kerr, projectSlug: null });
    expect(t.projectPath).toBeUndefined();
    expect(t.isCaseStudy).toBe(false);
  });
});

describe("testimonialFor", () => {
  it("finds the testimonial linked to a project, never by name", () => {
    expect(testimonialFor("nz-in-pictures", [kerr])?.name).toBe("David Kerr");
    expect(
      testimonialFor("nz-in-pictures", [{ ...kerr, projectSlug: null }]),
    ).toBeUndefined();
  });
});

describe("splitFirstSentence", () => {
  it("ignores dots inside web addresses and numbers", () => {
    expect(
      splitFirstSentence(
        "We hired Sam to rebuild nzinpictures.co.nz and sales doubled. Great work.",
      ),
    ).toEqual({
      lead: "We hired Sam to rebuild nzinpictures.co.nz and sales doubled.",
      rest: "Great work.",
    });
  });

  it("keeps a single sentence whole", () => {
    expect(splitFirstSentence("Brilliant work")).toEqual({
      lead: "Brilliant work",
    });
  });
});
