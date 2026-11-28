import { describe, expect, it } from "vitest";
import {
  excerptText,
  htmlToMarkdown,
  readingMinutes,
  stripHtml,
  withHeadingIds,
} from "./html";

describe("htmlToMarkdown", () => {
  it("converts headings, lists, links and emphasis", () => {
    const md = htmlToMarkdown(
      `<h2>Why it matters</h2><p>Read <a href="https://x.nz/a">our <strong>guide</strong></a> &amp; <em>act</em>.</p><ul><li>One</li><li>Two</li></ul>`,
    );
    expect(md).toBe(
      "## Why it matters\n\nRead [our guide](https://x.nz/a) & _act_.\n\n- One\n- Two",
    );
  });

  it("makes site-relative links absolute", () => {
    expect(
      htmlToMarkdown(
        '<p><a href="/contact">Get in touch</a></p>',
        0,
        "https://x.nz",
      ),
    ).toBe("[Get in touch](https://x.nz/contact)");
  });

  it("pushes headings down a level when asked", () => {
    expect(htmlToMarkdown("<h2>Section</h2>", 2)).toBe("#### Section");
  });

  it("drops scripts, images and comments", () => {
    expect(
      htmlToMarkdown(
        `<!-- wp:paragraph --><p>Hi<img src="a.png" alt="x"></p><script>alert(1)</script>`,
      ),
    ).toBe("Hi");
  });
});

describe("stripHtml", () => {
  it("drops tags and scripts and decodes entities", () => {
    expect(
      stripHtml(
        "<p>Fish &amp; chips</p><script>x()</script><p>&#8220;Hi&#8221;</p>",
      ),
    ).toBe("Fish & chips “Hi”");
  });
});

describe("excerptText", () => {
  it("returns short text unchanged", () => {
    expect(excerptText("<p>Short.</p>", 50)).toBe("Short.");
  });

  it("cuts long text at a word and adds an ellipsis", () => {
    expect(excerptText("one two three four", 12)).toBe("one two…");
  });
});

describe("readingMinutes", () => {
  it("is at least one minute", () => {
    expect(readingMinutes("<p>Hi</p>")).toBe(1);
    expect(readingMinutes("word ".repeat(660))).toBe(3);
  });
});

describe("withHeadingIds", () => {
  it("adds unique ids to h2/h3 and lists them", () => {
    const { html, toc } = withHeadingIds(
      "<h2>Why</h2><p>x</p><h3>Why</h3><h4>Skip</h4>",
    );
    expect(html).toBe(
      '<h2 id="why">Why</h2><p>x</p><h3 id="why-2">Why</h3><h4>Skip</h4>',
    );
    expect(toc).toEqual([
      { id: "why", text: "Why", level: 2 },
      { id: "why-2", text: "Why", level: 3 },
    ]);
  });
});
