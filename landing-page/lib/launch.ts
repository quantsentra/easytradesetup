// Launch-window helpers — kept as a stable shim so existing importers
// don't break. The product is permanently at the launch price; there is
// no countdown, no expiry, no inaugural window. Components that read
// these values render no countdown UI.
//
// Don't reintroduce a date here without also updating the copy strategy
// across /pricing, /checkout, OfferBanner, and the QA suite. The current
// model is "one permanent price, framed as 67% off retail."

export const LAUNCH_END_DATE = "9999-12-31";   // sentinel — far future, never expires
export const LAUNCH_END_DATE_LABEL = "always";  // human-readable; reads naturally in "ends always" → "always available"

export function daysUntilLaunchEnd(_today: Date = new Date()): number {
  // No expiry — always 0 to signal "no countdown to render".
  return 0;
}
