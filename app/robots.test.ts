import { describe, it, expect } from "vitest";
import robots from "./robots";

function rulesArray() {
  const r = robots().rules;
  return Array.isArray(r) ? r : [r];
}

describe("robots", () => {
  it("allows all user agents on the site root", () => {
    const general = rulesArray().find((r) => r.userAgent === "*");
    expect(general).toBeDefined();
    expect(general?.allow).toBe("/");
  });

  it("blocks the API but lets crawlers see the noindex on landing pages", () => {
    for (const rule of rulesArray()) {
      expect(rule.disallow).toBe("/api/");
    }
  });

  it("states an explicit policy for AI crawlers", () => {
    const ai = rulesArray().filter((r) => Array.isArray(r.userAgent));
    const agents = ai.flatMap((r) => r.userAgent as string[]);
    expect(agents).toEqual(
      expect.arrayContaining(["GPTBot", "ClaudeBot", "PerplexityBot"]),
    );
  });

  it("includes sitemap URL", () => {
    const result = robots();
    expect(result.sitemap).toContain("/sitemap.xml");
  });
});
