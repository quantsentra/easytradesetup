import { type VercelConfig } from "@vercel/config/v1";

/**
 * Vercel project config (replaces vercel.json).
 *
 * Cron schedules use cron syntax. /api/quotes is the hero ticker
 * source; hitting it on a schedule keeps the 5-minute edge cache
 * warm so first visitors of every region always render with real
 * data instead of fallback. /api/health pings keep platform-level
 * checks fresh and surface deploy version drift in monitoring.
 */
export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "next build",
  installCommand: "npm install",
  crons: [
    // Refresh quote cache every 30 min — Yahoo + Stooq sources
    // re-fetched, edge cache stays warm.
    { path: "/api/quotes", schedule: "*/30 * * * *" },
    // Health probe every 6 hours — surfaces deploy version,
    // Supabase reachability, and env-var presence in logs.
    { path: "/api/health", schedule: "0 */6 * * *" },
  ],
};
