import { describe, it, expect } from "vitest";
import {
  OFFER_USD,
  RETAIL_USD,
  USD_SET,
  OFFER_LABEL,
  OFFER_TAGLINE,
  DISCOUNT_PERCENT_USD,
  format,
} from "@/lib/pricing";

describe("lib/pricing — price integrity", () => {
  it("USD offer is cheaper than USD retail", () => {
    expect(OFFER_USD).toBeLessThan(RETAIL_USD);
  });

  it("discount sits in the honest 50–80% range the copy claims", () => {
    expect(DISCOUNT_PERCENT_USD).toBeGreaterThanOrEqual(50);
    expect(DISCOUNT_PERCENT_USD).toBeLessThanOrEqual(80);
  });

  it("USD price set exposes symbol + currency + values", () => {
    expect(USD_SET.symbol).toBe("$");
    expect(USD_SET.currency).toBe("USD");
    expect(USD_SET.offer).toBe(OFFER_USD);
    expect(USD_SET.retail).toBe(RETAIL_USD);
  });

  it("OFFER_LABEL and OFFER_TAGLINE are non-empty strings", () => {
    expect(OFFER_LABEL.length).toBeGreaterThan(0);
    expect(OFFER_TAGLINE.length).toBeGreaterThan(0);
  });
});

describe("lib/pricing — format()", () => {
  it("formats USD with comma grouping", () => {
    expect(format(USD_SET, 1234)).toBe("$1,234");
  });

  it("formats retail + offer via the helper without crashing", () => {
    expect(format(USD_SET, USD_SET.retail)).toContain("$");
    expect(format(USD_SET, USD_SET.offer)).toContain("$");
  });
});
