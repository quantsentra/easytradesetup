// Inaugural launch window for Golden Indicator.
// Edit the end date or reservation cap here; every surface on the site updates.

export const LAUNCH_END_DATE = "2026-05-15"; // ISO date — inaugural pricing ends at this date (23:59 IST)
export const LAUNCH_END_DATE_LABEL = "15 May 2026"; // human-readable copy
export const RESERVATION_CAP = 500;

export function daysUntilLaunchEnd(today: Date = new Date()): number {
  const end = new Date(`${LAUNCH_END_DATE}T23:59:59+05:30`);
  const ms = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
