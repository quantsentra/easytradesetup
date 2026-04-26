-- MVP focus checklist — frozen P0–P5 backlog tracked in admin.
-- Source of truth lives here so completion state is durable across
-- deploys and accessible to all admins. Edit the seed list with
-- migration 008+ if you need to add/remove items; never edit history.
--
-- The "frozen" rule: do not insert rows from the app. Only this
-- migration (and explicit follow-ups) can change the canonical list.
-- Toggling done/note is allowed.

create table if not exists mvp_tasks (
  slug          text        primary key,
  tier          text        not null check (tier in ('P0','P1','P2','P3','P4','P5')),
  position      integer     not null,
  title         text        not null,
  detail        text,
  done          boolean     not null default false,
  done_at       timestamptz,
  done_by       text,
  note          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists mvp_tasks_tier_idx on mvp_tasks (tier, position);

alter table mvp_tasks enable row level security;
create policy "no anon access to mvp_tasks"
  on mvp_tasks for all using (false) with check (false);

-- Seed: 25 items from the architecture doc backlog.
insert into mvp_tasks (slug, tier, position, title, detail) values
  ('p0-pageviews-migration',  'P0', 1, 'Run 005_pageviews.sql migration in Supabase',
    'Enables visitor KPIs in admin overview.'),
  ('p0-payments-wired',       'P0', 2, 'Wire payments — Razorpay UPI (India) + Gumroad (global)',
    'Add payments table + webhook handlers; insert entitlements on payment success.'),
  ('p0-lead-resend',          'P0', 3, '/api/lead → Resend send + Supabase leads table',
    'Replace console.log with persisted lead capture + welcome/notify emails.'),

  ('p1-ci-active',            'P1', 1, 'Activate GitHub Actions CI',
    'Open a no-op PR to trigger first run; surface badge in README.'),
  ('p1-quote-resilience',     'P1', 2, 'Quote API resilience',
    'Twelve Data fallback or Cloudflare Worker proxy for /api/quotes.'),
  ('p1-founder-bio',          'P1', 3, 'Real founder bio + photo + LinkedIn on /about',
    'Replace placeholder TS identifier.'),
  ('p1-testimonials',         'P1', 4, 'First customer testimonials on /principles (post-launch only)',
    'Written permission + verifiable purchase records required.'),
  ('p1-og-verify',            'P1', 5, 'OG image verification on Twitter / LinkedIn / WhatsApp',
    'Test live links via each platform debugger.'),

  ('p2-programmatic-grid',    'P2', 1, '/setup/[name] × /market/[m] programmatic grid',
    '24 long-tail SEO pages for setup × market combinations.'),
  ('p2-public-notes',         'P2', 2, '/notes/[slug] public market notes',
    'Public teasers; gated full body in /portal/updates.'),
  ('p2-internal-links',       'P2', 3, 'Internal link graph between /indicator/* and setup pages',
    'Every market page links to relevant setups and back.'),
  ('p2-image-optim',          'P2', 4, 'next/image AVIF + responsive sizes',
    'Replace all chart screenshots with optimized variants.'),

  ('p3-sparklines',           'P3', 1, 'Sparklines for visitors + revenue in admin',
    'Hand-rolled SVG, no chart library bloat.'),
  ('p3-csv-export',           'P3', 2, 'CSV export on /admin/customers',
    'Append ?export=csv to download.'),
  ('p3-cohort-retention',     'P3', 3, 'Cohort retention — entitlements × pageviews',
    'See repeat-visitor → buyer rate.'),
  ('p3-tickets-sla',          'P3', 4, 'Tickets SLA badge (>24h waiting)',
    'Highlight stale tickets in /admin/tickets.'),
  ('p3-country-breakdown',    'P3', 5, 'Country breakdown in admin overview',
    'Pageviews already capture country; add top-10 list.'),

  ('p4-supabase-backups',     'P4', 1, 'Verify Supabase backup retention',
    'Supabase Pro tier has automatic daily backups; check window.'),
  ('p4-sentry',               'P4', 2, 'Sentry error reporting (free tier)',
    'Wire @sentry/nextjs; 5k events/month free.'),
  ('p4-ratelimit-pageview',   'P4', 3, 'Rate-limit /api/track/pageview',
    'Use existing rate-limit lib.'),
  ('p4-pv-prune',             'P4', 4, 'Pageview retention prune job (>90d)',
    'Cron-trigger via GitHub Actions if Hobby plan has no Vercel cron.'),
  ('p4-botid',                'P4', 5, 'Vercel BotID on /checkout',
    'Filter form spam.'),

  ('p5-vercel-pro',           'P5', 1, 'Vercel Hobby → Pro for crons + longer timeouts',
    'Required for >1 cron and >300s timeouts.'),
  ('p5-multi-admin',          'P5', 2, 'Multi-admin via admins table inserts',
    'Already supported by schema; just seed more rows.'),
  ('p5-pdf-sku',              'P5', 3, 'Trade Logic PDF standalone $9 SKU',
    'entitlements.product already polymorphic.')
on conflict (slug) do nothing;
