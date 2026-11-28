import { describe, expect, it } from "vitest";
import { SERVICES } from "@/lib/services";
import { hasServiceIcon } from "./ServiceIcon";

describe("ServiceIcon", () => {
  it("has an icon for every service", () => {
    expect(SERVICES.filter((s) => !hasServiceIcon(s.slug))).toEqual([]);
  });
});
