// Inaugural launch window for Golden Indicator.
// Edit the end date or reservation cap here; every surface on the site updates.

export const LAUNCH_START_DATE = "2026-04-01"; // ISO date — inaugural window opens
export const LAUNCH_END_DATE = "2026-05-15";   // ISO date — inaugural pricing ends at this date (23:59 IST)
export const LAUNCH_END_DATE_LABEL = "15 May 2026"; // human-readable copy
export const RESERVATION_CAP = 500;

// Floor + ceiling of the "reserved" count shown to visitors.
// Conservative placeholder until real claim count wires to /api/lead tally.
export const RESERVATION_MIN_SHOWN = 120;
export const RESERVATION_MAX_SHOWN = 380; // cap well below 500 so "still available" feels true

export function daysUntilLaunchEnd(today: Date = new Date()): number {
  const end = new Date(`${LAUNCH_END_DATE}T23:59:59+05:30`);
  const ms = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

/**
 * Returns an estimated number of reservations claimed.
 * Linearly interpolates between RESERVATION_MIN_SHOWN and RESERVATION_MAX_SHOWN
 * across the launch window, so the number grows as the deadline approaches.
 * Pure function of time — no backend call.
 */
export function estimatedClaimed(today: Date = new Date()): number {
  const start = new Date(`${LAUNCH_START_DATE}T00:00:00+05:30`).getTime();
  const end   = new Date(`${LAUNCH_END_DATE}T23:59:59+05:30`).getTime();
  const now   = today.getTime();
  const pct   = Math.max(0, Math.min(1, (now - start) / (end - start)));
  const span  = RESERVATION_MAX_SHOWN - RESERVATION_MIN_SHOWN;
  return Math.round(RESERVATION_MIN_SHOWN + span * pct);
}
