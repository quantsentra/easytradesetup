-- Mark p1-quote-resilience done.
-- Run after 008. Idempotent — safe to re-run.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Code shipped: /api/quotes now Yahoo → Twelve Data → Stooq → baked-in fallback. Edge cache 5min fresh + 30min stale-while-revalidate. NIFTY now has a real upstream beyond Yahoo (Twelve Data). Set TWELVE_DATA_API_KEY in Vercel env (free 800/day key from twelvedata.com) to activate the second source; without it, Yahoo→Stooq→fallback chain still works.',
    updated_at = now()
where slug = 'p1-quote-resilience' and done = false;
