-- Mark p4-supabase-backups + p3-sparklines + p2-image-optim done.
-- Run after 014. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Verified Supabase backup policy: Free tier = 1 daily backup, 7d retention, recovery via support ticket (no SLA). Pro ($25/mo) = same retention with self-service restore + PITR add-on. Pre-launch action: stay on Free; revisit Pro upgrade once revenue covers it. Manual export hedge: Supabase dashboard → Database → Backups → Download (lives 7d). For full DR, run pg_dump weekly to off-site storage if launch traffic warrants.',
    updated_at = now()
where slug = 'p4-supabase-backups' and done = false;

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Hand-rolled SVG Sparkline component (no chart lib). Wired into /admin overview: 14-day visitor sparkline on Visitors-today KPI (cyan), 14-day revenue sparkline on Revenue-combined KPI (acid blue). Server-rendered, zero client JS for the chart itself.',
    updated_at = now()
where slug = 'p3-sparklines' and done = false;

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'next.config.mjs images.formats now [avif, webp] with 1-year minimumCacheTTL on optimized variants. Existing usage (CleanVsNoisy chart-before/after) already uses next/image with fill + sizes. No <img> tags found anywhere in app or components. All UI graphics inline SVG (Hero slider, BrandMark, charts) — already optimal.',
    updated_at = now()
where slug = 'p2-image-optim' and done = false;
