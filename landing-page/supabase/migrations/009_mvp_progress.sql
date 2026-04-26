-- Mark p1-quote-resilience done.
-- Run after 008. Idempotent — safe to re-run.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Code shipped. Source chain: Yahoo → Twelve Data (multi-variant) → Stooq → baked-in. Edge cache 5min fresh + 30min stale-while-revalidate. Live state: Gold = Twelve Data (XAU/USD), US30 = Stooq (Yahoo blocked from Vercel IP). NIFTY = baked-in fallback (Yahoo blocked, Twelve Data free tier does not cover NIFTY 50, Stooq has no NIFTY). Fallback price updates require manual edit in app/api/quotes/route.ts SYMBOLS[].fallback. Long-term fix for NIFTY: Cloudflare Worker proxy that fetches Yahoo from non-blocked IP — captured as future P5.',
    updated_at = now()
where slug = 'p1-quote-resilience';
