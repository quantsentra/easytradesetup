// Single source of truth for EasyTradeSetup pricing.
// Edit these values in one place and every surface on the site updates.
//
// Pricing model: one permanent launch price. No countdowns, no inaugural
// window, no expiry. Retail figure stays as a visual anchor for the
// always-on "67% off retail" framing.

// Live USD→INR rate, captured 2026-04-21 via open.er-api.com
export const USD_TO_INR = 93.17;

// Retail / anchor price — never charged; used only as a strikethrough.
export const RETAIL_USD = 149;
export const RETAIL_INR = 13999; // 149 × 93.17 ≈ 13,882 — rounded to ₹13,999 for psych pricing

// Permanent launch price — always charged at this amount.
export const OFFER_USD = 49;
export const OFFER_INR = 4599; // 49 × 93.17 ≈ 4,565 — rounded to ₹4,599

// Discount percentages, computed at module load. Used in copy ("67% off").
export const DISCOUNT_PERCENT_USD = Math.round((1 - OFFER_USD / RETAIL_USD) * 100);
export const DISCOUNT_PERCENT_INR = Math.round((1 - OFFER_INR / RETAIL_INR) * 100);

export const OFFER_LABEL = "Launch price";
export const OFFER_TAGLINE = `${DISCOUNT_PERCENT_USD}% off retail. Always.`;

export type Currency = "USD" | "INR";

export type PriceSet = {
  currency: Currency;
  symbol: string;
  retail: number;
  offer: number;
  locale: string;
};

export const USD_SET: PriceSet = {
  currency: "USD",
  symbol: "$",
  retail: RETAIL_USD,
  offer: OFFER_USD,
  locale: "en-US",
};

export const INR_SET: PriceSet = {
  currency: "INR",
  symbol: "₹",
  retail: RETAIL_INR,
  offer: OFFER_INR,
  locale: "en-IN",
};

export function format(set: PriceSet, amount: number): string {
  return `${set.symbol}${amount.toLocaleString(set.locale)}`;
}
