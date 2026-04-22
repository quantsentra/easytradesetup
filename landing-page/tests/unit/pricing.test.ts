import { describe, it, expect } from "vitest";
import {
  OFFER_USD,
  OFFER_INR,
  RETAIL_USD,
  RETAIL_INR,
  USD_TO_INR,
  USD_SET,
  INR_SET,
  OFFER_LABEL,
  OFFER_TAGLINE,
  format,
} from "@/lib/pricing";

describe("lib/pricing — price integrity", () => {
  it("USD offer is cheaper than USD retail", () => {
    expect(OFFER_USD).toBeLessThan(RETAIL_USD);
  });

  it("INR offer is cheaper than INR retail", () => {
    expect(OFFER_INR).toBeLessThan(RETAIL_INR);
  });

  it("INR offer roughly matches USD offer × FX rate (±20%)", () => {
    const implied = OFFER_USD * USD_TO_INR;
    const ratio = OFFER_INR / implied;
    expect(ratio).toBeGreaterThan(0.8);
    expect(ratio).toBeLessThan(1.2);
  });

  it("USD/INR price sets expose symbol + currency + values", () => {
    expect(USD_SET.symbol).toBe("$");
    expect(USD_SET.currency).toBe("USD");
    expect(USD_SET.offer).toBe(OFFER_USD);
    expect(USD_SET.retail).toBe(RETAIL_USD);
    expect(INR_SET.symbol).toBe("₹");
    expect(INR_SET.currency).toBe("INR");
    expect(INR_SET.offer).toBe(OFFER_INR);
    expect(INR_SET.retail).toBe(RETAIL_INR);
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

  it("formats INR with Indian grouping (lakh)", () => {
    // 100000 = 1,00,000 in en-IN locale
    expect(format(INR_SET, 100000)).toMatch(/^₹1,00,000$/);
  });

  it("formats retail + offer via the helper without crashing", () => {
    expect(format(USD_SET, USD_SET.retail)).toContain("$");
    expect(format(INR_SET, INR_SET.offer)).toContain("₹");
  });
});
