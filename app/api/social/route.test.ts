import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { POST } = await import("./route");

const SECRET = "social-secret";
const fetchSpy = vi.spyOn(globalThis, "fetch");

function req(body: unknown, secret?: string) {
  return new Request("http://localhost/api/social", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;
}

const post = {
  type: "post",
  title: "New article",
  url: "https://everydaydigital.co.nz/blog/new-article",
};

describe("POST /api/social", () => {
  beforeEach(() => {
    vi.stubEnv("SOCIAL_WEBHOOK_SECRET", SECRET);
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("SOCIAL_LIVE", "");
    fetchSpy.mockReset();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("returns 500 when the secret isn't configured", async () => {
    vi.stubEnv("SOCIAL_WEBHOOK_SECRET", "");
    expect((await POST(req(post, SECRET))).status).toBe(500);
  });

  it("rejects a wrong secret", async () => {
    expect((await POST(req(post, "nope"))).status).toBe(401);
  });

  it("rejects a payload without a valid type", async () => {
    const res = await POST(req({ ...post, type: "page" }, SECRET));
    expect(res.status).toBe(400);
  });

  it("in test mode, writes captions but posts nothing", async () => {
    const res = await POST(req(post, SECRET));
    const json = await res.json();
    expect(json).toMatchObject({ ok: true, dryRun: true, aiCaptions: false });
    expect(json.captions.facebook).toMatch(/^New on the blog: New article/);
    expect(json.results).toEqual({});
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
