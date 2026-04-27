// Currency resolution shared between server, client, middleware, and API.
// Source of truth precedence:
//   1. ?ccy=inr|usd query param   (manual override, written to cookie)
//   2. ets_ccy cookie             (set by middleware on first visit)
//   3. x-vercel-ip-country = "IN" (geo fallback when no cookie yet)
//   4. "usd"                      (final default)
//
// The cookie is what the UI reads — middleware ensures it's always set.
// Client and server reach the same answer because both read the cookie.

export type Currency = "usd" | "inr";

export const CURRENCY_COOKIE = "ets_ccy";
export const CURRENCY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function isValidCurrency(v: string | null | undefined): v is Currency {
  return v === "usd" || v === "inr";
}

export function resolveCurrency(input: {
  query?: string | null;
  cookie?: string | null;
  ipCountry?: string | null;
}): Currency {
  const q = (input.query || "").toLowerCase();
  if (isValidCurrency(q)) return q;
  const c = (input.cookie || "").toLowerCase();
  if (isValidCurrency(c)) return c;
  if ((input.ipCountry || "").toUpperCase() === "IN") return "inr";
  return "usd";
}

// Browser-only — read the cookie sync at component mount.
export function readCurrencyCookieClient(): Currency {
  if (typeof document === "undefined") return "usd";
  const match = document.cookie.match(new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([^;]*)`));
  const v = match ? decodeURIComponent(match[1]) : null;
  return isValidCurrency(v) ? v : "usd";
}

// Browser-only — write a fresh cookie when user manually toggles.
export function writeCurrencyCookieClient(c: Currency): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CURRENCY_COOKIE}=${c}; path=/; max-age=${CURRENCY_COOKIE_MAX_AGE}; samesite=lax`;
}
