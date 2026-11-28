import { describe, expect, it } from "vitest";
import { hasBearerSecret } from "./auth";

const req = (authorization?: string) =>
  new Request("http://localhost/", {
    headers: authorization ? { authorization } : {},
  });

describe("hasBearerSecret", () => {
  it("accepts the matching bearer token, whatever the scheme's case", () => {
    expect(hasBearerSecret(req("Bearer s3cret"), "s3cret")).toBe(true);
    expect(hasBearerSecret(req("bearer  s3cret "), "s3cret")).toBe(true);
  });

  it("rejects a wrong, partial or missing token", () => {
    expect(hasBearerSecret(req("Bearer nope"), "s3cret")).toBe(false);
    expect(hasBearerSecret(req("Bearer s3cre"), "s3cret")).toBe(false);
    expect(hasBearerSecret(req("s3cret"), "s3cret")).toBe(false);
    expect(hasBearerSecret(req(), "s3cret")).toBe(false);
  });

  it("rejects everything when no secret is configured", () => {
    expect(hasBearerSecret(req("Bearer "), "")).toBe(false);
    expect(hasBearerSecret(req("Bearer x"), undefined)).toBe(false);
  });
});
