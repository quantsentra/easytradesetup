-- Multi-update: drop p3-tickets-sla + p2-public-notes, mark
-- p4-ratelimit-pageview + p4-pv-prune done.
-- Run after 013. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · scope-removed',
    note = 'Removed from scope per founder decision. Tickets system stays simple — admin replies in /admin/tickets, no SLA badge needed at MVP scale.',
    updated_at = now()
where slug = 'p3-tickets-sla' and done = false;

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · scope-removed',
    note = 'Removed from scope. Public-facing market notes deferred — full notes stay portal-gated as customer-only value. Will reconsider post-launch if SEO traffic stalls.',
    updated_at = now()
where slug = 'p2-public-notes' and done = false;

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Wired lib/rate-limit.ts (existing sliding-window limiter) into POST /api/track/pageview. Window: 60 inserts/IP/min. Returns 429 with Retry-After header on overage. Pre-body check so abusive callers cannot exhaust JSON parser.',
    updated_at = now()
where slug = 'p4-ratelimit-pageview' and done = false;

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'POST /api/admin/pv-prune deletes pageviews older than 90d. Auth via shared bearer secret (PV_PRUNE_SECRET env). GitHub Actions schedule .github/workflows/prune.yml fires daily 03:17 UTC, calls endpoint with secret. Manual trigger via workflow_dispatch. Setup: set PV_PRUNE_SECRET in both Vercel env AND GitHub repo Actions secrets.',
    updated_at = now()
where slug = 'p4-pv-prune' and done = false;
