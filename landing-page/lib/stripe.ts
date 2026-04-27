import "server-only";
import Stripe from "stripe";

/**
 * Server-side Stripe SDK. Reads STRIPE_SECRET_KEY from env at runtime.
 * Never import this from a Client Component — bundle leaks the secret.
 *
 * apiVersion is pinned so behaviour is deterministic across SDK upgrades.
 * Bump only after reading the changelog for the new version.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY missing — set in Vercel env vars (Production + Preview)");
  }
  cached = new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
    appInfo: {
      name: "EasyTradeSetup",
      version: "1.0.0",
      url: "https://www.easytradesetup.com",
    },
  });
  return cached;
}

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
