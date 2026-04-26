// Inaugural launch window for Golden Indicator.
// Edit the end date here; every countdown on the site updates.

export const LAUNCH_START_DATE = "2026-04-01"; // ISO date — inaugural window opens
export const LAUNCH_END_DATE = "2026-05-15";   // ISO date — inaugural pricing ends at this date (23:59 IST)
export const LAUNCH_END_DATE_LABEL = "15 May 2026"; // human-readable copy

export function daysUntilLaunchEnd(today: Date = new Date()): number {
  const end = new Date(`${LAUNCH_END_DATE}T23:59:59+05:30`);
  const ms = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
