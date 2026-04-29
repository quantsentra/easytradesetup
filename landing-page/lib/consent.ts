// Cookie-based consent state — kept simple to avoid pulling in a full CMP.
//
// Two values:
//   "all"       — visitor opted into Clarity heatmaps + session recordings.
//   "essential" — visitor declined non-essential cookies. Clarity does not load.
// No cookie set yet → banner shows. Default behaviour while undecided is
// "essential" (no Clarity), so the strictest interpretation of GDPR / DPDPA
// is satisfied: tracking only after explicit affirmative action.
//
// Constants + types only — safe for both client and server. Server-side
// reader lives in lib/consent-server.ts because it imports next/headers
// which is a server-only module.

export type ConsentState = "all" | "essential" | "unset";

export const CONSENT_COOKIE = "ets_consent";
export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function isValidConsent(v: string | null | undefined): v is "all" | "essential" {
  return v === "all" || v === "essential";
}
