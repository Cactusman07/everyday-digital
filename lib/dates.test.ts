import { describe, expect, it } from "vitest";
import { formatDate, gmt, latest, newestFirst, publishedAt } from "./dates";

describe("gmt", () => {
  it("marks WordPress GMT dates as UTC", () => {
    expect(gmt("2026-11-19T09:30:00")).toBe("2026-11-19T09:30:00Z");
  });

  it("leaves dates that already have a zone alone", () => {
    expect(gmt("2026-11-19T09:30:00Z")).toBe("2026-11-19T09:30:00Z");
    expect(gmt("2026-11-19T09:30:00+13:00")).toBe("2026-11-19T09:30:00+13:00");
    expect(gmt(undefined)).toBeUndefined();
  });
});

describe("newestFirst", () => {
  it("sorts by date without changing the input", () => {
    const items = [{ date: "2026-01-01" }, { date: "2026-03-01" }, {}];
    expect(newestFirst(items)).toEqual([
      { date: "2026-03-01" },
      { date: "2026-01-01" },
      {},
    ]);
    expect(items[0]).toEqual({ date: "2026-01-01" });
  });
});

describe("latest", () => {
  it("picks the latest ISO date, ignoring gaps", () => {
    expect(latest(["2026-01-01Z", undefined, "2026-05-01Z"])).toBe(
      "2026-05-01Z",
    );
    expect(latest([undefined])).toBeUndefined();
  });
});

describe("publishedAt", () => {
  it("prefers the UTC date and falls back to the local one", () => {
    expect(
      publishedAt({
        date: "2026-11-19T22:30:00",
        dateGmt: "2026-11-19T09:30:00",
      }),
    ).toBe("2026-11-19T09:30:00Z");
    expect(publishedAt({ date: "2026-11-19T22:30:00" })).toBe(
      "2026-11-19T22:30:00",
    );
  });
});

describe("formatDate", () => {
  it("writes out the day WordPress gave, whatever the server's zone", () => {
    expect(formatDate("2026-11-19T23:30:00")).toBe("19 November 2026");
    expect(formatDate("2026-11-19T00:15:00")).toBe("19 November 2026");
    expect(formatDate(undefined)).toBe("");
  });
});
