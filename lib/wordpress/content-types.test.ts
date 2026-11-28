import { describe, expect, it } from "vitest";
import { itemPath, toContentType } from "./content-types";

describe("toContentType", () => {
  it("accepts canonical, plural and capitalised post types", () => {
    expect(toContentType("post")).toBe("post");
    expect(toContentType("Projects")).toBe("project");
    expect(toContentType("testimonials")).toBe("testimonial");
  });

  it("rejects unknown types", () => {
    expect(toContentType("attachment")).toBeUndefined();
    expect(toContentType("constructor")).toBeUndefined();
    expect(toContentType(undefined)).toBeUndefined();
  });
});

describe("itemPath", () => {
  it("puts each type in its section", () => {
    expect(itemPath("post", "hi")).toBe("/blog/hi");
    expect(itemPath("project", "x")).toBe("/projects/x");
    expect(itemPath("service", "hosting")).toBe("/services/hosting");
  });
});
