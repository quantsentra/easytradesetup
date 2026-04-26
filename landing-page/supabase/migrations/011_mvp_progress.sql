-- Mark p3-country-breakdown done.
-- Drop p1-founder-bio (out of scope — product-led, not founder-led brand).
-- Run after 010. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Top-10 country block + flag emojis live on /admin overview. Aggregates unique visitors per country from pageviews (last 30d). Country resolves from x-vercel-ip-country edge header at pageview-track time. 44 country names hardcoded for top markets; unmapped codes fall through to ISO code display.',
    updated_at = now()
where slug = 'p3-country-breakdown' and done = false;

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · scope-removed',
    note = 'Removed from scope. Brand will be product-led / result-led, not founder-led — owner stays behind the scenes. /about will be reframed around outcomes and the indicator itself, not a personal bio. Closed without action.',
    updated_at = now()
where slug = 'p1-founder-bio' and done = false;
