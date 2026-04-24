// Simple in-memory sliding-window rate limiter keyed by IP. No external deps.
//
// LIMITATION: Serverless containers may scale horizontally; each instance
// keeps its own counter. This mitigates casual abuse (single bot hammering
// one cold node) but not distributed / high-volume floods. For production
// stopping-power at scale, swap the Map for a KV-backed store
// (Upstash Ratelimit, Vercel KV, Redis, etc.).

type Bucket = { hits: number[]; };

const buckets = new Map<string, Bucket>();

// Cap the map so it cannot grow unbounded under a botnet.
const MAX_KEYS = 10_000;

export type RateLimitConfig = {
  windowMs: number;      // sliding window length
  max: number;           // max hits per window
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
};

export function rateLimit(
  key: string,
  config: RateLimitConfig,
  now: number = Date.now(),
): RateLimitResult {
  if (buckets.size > MAX_KEYS) {
    // Evict the oldest key. Cheap GC under memory pressure.
    const first = buckets.keys().next().value;
    if (first) buckets.delete(first);
  }

  const bucket = buckets.get(key) ?? { hits: [] };
  const windowStart = now - config.windowMs;
  bucket.hits = bucket.hits.filter((t) => t > windowStart);

  if (bucket.hits.length >= config.max) {
    buckets.set(key, bucket);
    const oldest = bucket.hits[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + config.windowMs - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return {
    allowed: true,
    remaining: Math.max(0, config.max - bucket.hits.length),
    retryAfterSec: 0,
  };
}

/** Exported for tests. Do not call from app code. */
export function __resetRateLimit(): void {
  buckets.clear();
}

/** Best-effort client IP lookup from request headers. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  const first = xff.split(",")[0].trim();
  if (first) return first;
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("fastly-client-ip") ||
    "unknown"
  );
}
