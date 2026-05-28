// Single source of truth for EasyTradeSetup pricing.
// Edit these values in one place and every surface on the site updates.
//
// Pricing model: one permanent launch price, USD only. No countdowns, no
// inaugural window, no expiry. Retail figure stays as a visual anchor for
// the always-on "67% off retail" framing.

// Retail / anchor price — never charged; used only as a strikethrough.
export const RETAIL_USD = 149;

// Permanent launch price — always charged at this amount.
export const OFFER_USD = 49;

// Discount percentage, computed at module load. Used in copy ("67% off").
export const DISCOUNT_PERCENT_USD = Math.round((1 - OFFER_USD / RETAIL_USD) * 100);

export const OFFER_LABEL = "Launch price";
export const OFFER_TAGLINE = `${DISCOUNT_PERCENT_USD}% off retail. Always.`;

export type Currency = "USD";

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

export function format(set: PriceSet, amount: number): string {
  return `${set.symbol}${amount.toLocaleString(set.locale)}`;
}
