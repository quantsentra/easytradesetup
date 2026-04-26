import { describe, it, expect } from "vitest";
import {
  LAUNCH_END_DATE,
  LAUNCH_END_DATE_LABEL,
  daysUntilLaunchEnd,
} from "@/lib/launch";

describe("lib/launch", () => {
  it("exposes LAUNCH_END_DATE in ISO format (YYYY-MM-DD)", () => {
    expect(LAUNCH_END_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("LAUNCH_END_DATE_LABEL is human-readable", () => {
    expect(LAUNCH_END_DATE_LABEL).toMatch(/[A-Za-z]/);
    expect(LAUNCH_END_DATE_LABEL.length).toBeGreaterThan(5);
  });

  it("daysUntilLaunchEnd returns 0 when today is after launch end", () => {
    const after = new Date(`${LAUNCH_END_DATE}T23:59:59+05:30`);
    after.setDate(after.getDate() + 1);
    expect(daysUntilLaunchEnd(after)).toBe(0);
  });

  it("daysUntilLaunchEnd returns positive integer before launch end", () => {
    const before = new Date(`${LAUNCH_END_DATE}T23:59:59+05:30`);
    before.setDate(before.getDate() - 5);
    const d = daysUntilLaunchEnd(before);
    expect(d).toBeGreaterThanOrEqual(1);
    expect(d).toBeLessThanOrEqual(6);
    expect(Number.isInteger(d)).toBe(true);
  });

  it("daysUntilLaunchEnd never returns negative value", () => {
    const far = new Date(`${LAUNCH_END_DATE}T23:59:59+05:30`);
    far.setFullYear(far.getFullYear() + 10);
    expect(daysUntilLaunchEnd(far)).toBe(0);
  });
});
