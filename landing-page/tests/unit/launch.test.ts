import { describe, it, expect } from "vitest";
import {
  LAUNCH_END_DATE,
  LAUNCH_END_DATE_LABEL,
  daysUntilLaunchEnd,
} from "@/lib/launch";

// The launch lib is a stable shim under the permanent-launch-price model:
// nothing should expire, daysUntilLaunchEnd always reports 0, and the
// label reads naturally where existing copy uses it.

describe("lib/launch (permanent launch price)", () => {
  it("LAUNCH_END_DATE is an ISO date sentinel in the far future", () => {
    expect(LAUNCH_END_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Date.parse(LAUNCH_END_DATE)).toBeGreaterThan(Date.now());
  });

  it("LAUNCH_END_DATE_LABEL is a non-empty string", () => {
    expect(LAUNCH_END_DATE_LABEL.length).toBeGreaterThan(0);
  });

  it("daysUntilLaunchEnd always returns 0 — no countdown UI rendered", () => {
    expect(daysUntilLaunchEnd(new Date())).toBe(0);
    expect(daysUntilLaunchEnd(new Date("2026-01-01"))).toBe(0);
    expect(daysUntilLaunchEnd(new Date("2030-01-01"))).toBe(0);
  });
});
