import { describe, expect, it } from "vitest";
import { fallbackCaptions, parseCaptions } from "./captions";
import { toLinkedInCommentary } from "./channels";
import { parseSharePayload } from "./types";

const valid = {
  type: "post",
  title: " New article ",
  url: "https://everydaydigital.co.nz/blog/new-article",
  tags: ["SEO", 3],
};

describe("parseSharePayload", () => {
  it("accepts a post or project and tidies the fields", () => {
    expect(parseSharePayload(valid)).toMatchObject({
      type: "post",
      title: "New article",
      tags: ["SEO"],
    });
    expect(parseSharePayload({ ...valid, type: "Projects" }).type).toBe(
      "project",
    );
  });

  it.each([
    [{ ...valid, type: undefined }, /type/],
    [{ ...valid, type: "page" }, /type/],
    [{ ...valid, title: "" }, /title/],
    [{ ...valid, url: "/blog/x" }, /url/],
    [null, /object/],
  ])("rejects %j", (body, error) => {
    expect(() => parseSharePayload(body)).toThrow(error);
  });
});

describe("captions", () => {
  it("words the fallback by type", () => {
    const post = parseSharePayload(valid);
    const project = parseSharePayload({ ...valid, type: "project" });
    expect(fallbackCaptions(post).facebook).toMatch(/^New on the blog/);
    expect(fallbackCaptions(project).facebook).toMatch(/^Project delivered/);
  });

  it("requires all three captions", () => {
    expect(() => parseCaptions('{"linkedin":"a","facebook":"b"}')).toThrow(
      /instagram/,
    );
    expect(
      parseCaptions('{"linkedin":"a","facebook":"b","instagram":"c"}'),
    ).toEqual({ linkedin: "a", facebook: "b", instagram: "c" });
  });
});

describe("toLinkedInCommentary", () => {
  it("makes hashtags clickable and escapes other markup", () => {
    expect(toLinkedInCommentary("Speed (really) matters #webdesign #NZ")).toBe(
      String.raw`Speed \(really\) matters {hashtag|\#|webdesign} {hashtag|\#|NZ}`,
    );
  });
});
