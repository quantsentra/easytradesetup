-- EasyTradeSetup — consolidated schema reset for a FRESH Supabase project.
-- Generated from supabase/migrations/001..028 in order.
-- Usage: Supabase dashboard → SQL Editor → paste this whole file → Run.
-- One-shot on an empty DB. Recreates every table the app reads/writes.
--
-- After running: set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
-- / SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy.


-- ======================================================================
-- 001_portal_schema.sql
-- ======================================================================
-- EasyTradeSetup portal — initial schema.
-- Run via: supabase db push  (or paste into Supabase dashboard SQL editor).
--
-- Design notes:
--  * User identity is owned by Clerk. We store Clerk user IDs as text and
--    do NOT use Supabase's auth.users table.
--  * RLS is enabled on every table. The portal talks to Supabase only via
--    the service-role key (server-side), so RLS acts as defense-in-depth.
--  * Timestamps are UTC. Application code formats for display.

create table if not exists entitlements (
  user_id       text        not null,
  product       text        not null default 'golden-indicator',
  active        boolean     not null default true,
  granted_at    timestamptz not null default now(),
  revoked_at    timestamptz,
  source        text        not null check (source in ('stripe','razorpay','manual','refund')),
  primary key (user_id, product)
);

create index if not exists entitlements_active_idx on entitlements (user_id, active);

alter table entitlements enable row level security;

-- Download audit log — who fetched what, when. Useful for refund abuse
-- detection and per-file analytics.
create table if not exists downloads (
  id        bigserial primary key,
  user_id   text        not null,
  path      text        not null,
  at        timestamptz not null default now()
);

create index if not exists downloads_user_at_idx on downloads (user_id, at desc);

alter table downloads enable row level security;

-- Market-notes / updates. Admin inserts rows from the portal admin UI or
-- directly in the dashboard. Customers read via /portal/updates.
create table if not exists updates (
  id            uuid        primary key default gen_random_uuid(),
  slug          text        not null unique,
  title         text        not null,
  excerpt       text        not null default '',
  body_mdx      text        not null default '',
  published_at  timestamptz not null default now(),
  draft         boolean     not null default false,
  created_by    text,       -- Clerk user ID of the admin
  created_at    timestamptz not null default now()
);

create index if not exists updates_published_idx on updates (published_at desc) where draft = false;

alter table updates enable row level security;

-- Admins — simple allow-list keyed by Clerk user ID. A user is an admin
-- iff a row exists here. No row = regular user.
create table if not exists admins (
  user_id    text primary key,
  granted_at timestamptz not null default now(),
  note       text
);

alter table admins enable row level security;

-- Policies. Service-role bypasses RLS, so these policies describe what
-- the anon key is allowed to see (intentionally almost nothing — we do
-- not want clients to read entitlements directly).

create policy "no anon read of entitlements"
  on entitlements for select
  using (false);

create policy "no anon read of downloads"
  on downloads for select
  using (false);

create policy "no anon read of admins"
  on admins for select
  using (false);

-- Published market notes are readable by anon for preview / SEO teasers,
-- but the full body is only fetched server-side behind entitlement check.
create policy "anon can read published update metadata"
  on updates for select
  using (draft = false);


-- ======================================================================
-- 002_tickets.sql
-- ======================================================================
-- Support tickets. Customers open them in /portal/support;
-- admins answer in /admin/tickets. RLS is on; the app uses the
-- service-role key for all reads/writes, so policies are deny-all
-- for the anon key (defense-in-depth).

create table if not exists tickets (
  id           uuid        primary key default gen_random_uuid(),
  user_id      text        not null,                 -- Clerk user ID
  subject      text        not null,
  status       text        not null default 'open'
                          check (status in ('open','waiting','resolved','closed')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists tickets_user_created_idx on tickets (user_id, created_at desc);
create index if not exists tickets_status_updated_idx on tickets (status, updated_at desc);

alter table tickets enable row level security;
create policy "no anon access to tickets"
  on tickets for all using (false) with check (false);

-- Ticket messages. First row is the customer's opener; subsequent
-- rows alternate between customer and admin. `author` = 'customer'
-- or 'admin' so we can render bubbles correctly without joining
-- against an admins table on every render.
create table if not exists ticket_messages (
  id           uuid        primary key default gen_random_uuid(),
  ticket_id    uuid        not null references tickets(id) on delete cascade,
  author       text        not null check (author in ('customer','admin')),
  author_id    text        not null,                 -- Clerk user ID of whoever wrote it
  body         text        not null,
  created_at   timestamptz not null default now()
);

create index if not exists ticket_messages_ticket_created_idx
  on ticket_messages (ticket_id, created_at asc);

alter table ticket_messages enable row level security;
create policy "no anon access to ticket messages"
  on ticket_messages for all using (false) with check (false);

-- Bump tickets.updated_at whenever a new message lands, so the
-- admin inbox can sort by last-activity without a subquery.
create or replace function bump_ticket_updated_at()
  returns trigger language plpgsql as $$
begin
  update tickets set updated_at = now() where id = new.ticket_id;
  return new;
end;
$$;

drop trigger if exists ticket_messages_bump on ticket_messages;
create trigger ticket_messages_bump
  after insert on ticket_messages
  for each row execute function bump_ticket_updated_at();


-- ======================================================================
-- 003_audit_log.sql
-- ======================================================================
-- Admin audit log. Every privileged write lands here so we have a
-- chronological record of who did what. Read-only from the app —
-- rows are inserted by the audit helper, never updated or deleted.

create table if not exists admin_audit_log (
  id           bigserial   primary key,
  at           timestamptz not null default now(),
  actor_id     text        not null,                -- Clerk user ID of the admin
  action       text        not null,                -- e.g. 'update.publish', 'ticket.status.change'
  target_kind  text,                                -- e.g. 'update', 'ticket', 'entitlement'
  target_id    text,                                -- row ID or slug of the target
  metadata     jsonb       not null default '{}'    -- free-form: old/new values, notes, etc.
);

create index if not exists admin_audit_at_idx on admin_audit_log (at desc);
create index if not exists admin_audit_actor_idx on admin_audit_log (actor_id, at desc);
create index if not exists admin_audit_action_idx on admin_audit_log (action, at desc);

alter table admin_audit_log enable row level security;
create policy "no anon access to audit log"
  on admin_audit_log for all using (false) with check (false);


-- ======================================================================
-- 004_user_activity.sql
-- ======================================================================
-- Per-user activity tracking. Used to drive "welcome back" copy on
-- /portal and to count new market notes since the user's last visit.
--
-- One row per Clerk user. Upserted on every portal dashboard render.
-- We intentionally do NOT track per-page dwell time, scroll depth, or
-- anything that would make this feel like surveillance — just a simple
-- last-seen timestamp + visit counter for the returning-user UX.

create table if not exists user_activity (
  user_id         text        primary key,
  last_seen_at    timestamptz not null default now(),
  visit_count     integer     not null default 0,
  first_seen_at   timestamptz not null default now()
);

create index if not exists user_activity_last_seen_idx
  on user_activity (last_seen_at desc);

alter table user_activity enable row level security;
create policy "no anon access to user_activity"
  on user_activity for all using (false) with check (false);


-- ======================================================================
-- 005_pageviews.sql
-- ======================================================================
-- Anonymous pageview tracking for marketing pages.
-- Self-hosted alternative to Vercel Analytics — gives admin overview
-- access to traffic numbers without leaving the dashboard.
--
-- Privacy:
--  * No raw IPs stored.
--  * visitor_id is sha256(salt + ip + user_agent + date) — rotates daily so
--    long-term cross-day re-identification is not possible.
--  * Country comes from edge geo header (x-vercel-ip-country) only.

create table if not exists pageviews (
  id         bigserial primary key,
  visitor_id text        not null,
  path       text        not null,
  referer    text,
  country    text,
  at         timestamptz not null default now()
);

create index if not exists pageviews_at_idx on pageviews (at desc);
create index if not exists pageviews_visitor_idx on pageviews (visitor_id, at desc);
create index if not exists pageviews_path_idx on pageviews (path, at desc);

alter table pageviews enable row level security;

create policy "no anon access to pageviews"
  on pageviews for all
  using (false) with check (false);


-- ======================================================================
-- 006_leads.sql
-- ======================================================================
-- Email leads from /api/lead — the buy-link waitlist before payments
-- go live. After payments wire up, this table holds the pre-purchase
-- intent funnel (sign-up didn't necessarily convert).
--
-- Privacy:
--  * Raw IP not stored. ip_hash is sha256(salt + ip) — sufficient for
--    abuse detection / dedup, not enough for re-identification.
--  * email is stored in plaintext (it's the whole point of the table).

create table if not exists leads (
  id          bigserial   primary key,
  email       text        not null,
  source      text        not null default 'unknown',
  ip_hash     text,
  user_agent  text,
  country     text,
  referer     text,
  created_at  timestamptz not null default now()
);

create index if not exists leads_created_idx on leads (created_at desc);
create index if not exists leads_email_idx on leads (email);
create index if not exists leads_source_idx on leads (source, created_at desc);

alter table leads enable row level security;

create policy "no anon access to leads"
  on leads for all
  using (false) with check (false);


-- ======================================================================
-- 007_mvp_tasks.sql
-- ======================================================================
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


-- ======================================================================
-- 008_mvp_progress.sql
-- ======================================================================
-- Mark backlog items completed so far.
-- Run after 007_mvp_tasks.sql. Idempotent — safe to re-run.
--
-- Discipline rule (carried over from 007): items can only be added or
-- their state changed by migrations. The admin UI can toggle done +
-- note, but seed corrections live here.

-- p0-lead-resend: code shipped in commit 2498e72.
-- Capture pipeline: /api/lead → leads table insert + Resend (welcome
-- email to lead + admin notify). Both DB + email are best-effort so
-- form submission cannot fail on infra hiccups.
update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · 2498e72',
    note = 'Code shipped commit 2498e72. Live after: (1) run 006_leads.sql migration, (2) set RESEND_API_KEY in Vercel env, (3) verify easytradesetup.com domain in Resend then swap LEAD_FROM_EMAIL.',
    updated_at = now()
where slug = 'p0-lead-resend' and done = false;


-- ======================================================================
-- 009_mvp_progress.sql
-- ======================================================================
-- Mark p1-quote-resilience done.
-- Run after 008. Idempotent — safe to re-run.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Code shipped. Source chain: Yahoo → Twelve Data (multi-variant) → Stooq → baked-in. Edge cache 5min fresh + 30min stale-while-revalidate. Live state: Gold = Twelve Data (XAU/USD), US30 = Stooq (Yahoo blocked from Vercel IP). NIFTY = baked-in fallback (Yahoo blocked, Twelve Data free tier does not cover NIFTY 50, Stooq has no NIFTY). Fallback price updates require manual edit in app/api/quotes/route.ts SYMBOLS[].fallback. Long-term fix for NIFTY: Cloudflare Worker proxy that fetches Yahoo from non-blocked IP — captured as future P5.',
    updated_at = now()
where slug = 'p1-quote-resilience';


-- ======================================================================
-- 010_mvp_progress.sql
-- ======================================================================
-- Mark p1-ci-active done.
-- Run after 009. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Confirmed via GitHub API: 21 successful runs against main, latest green on commit 19cc7ff. Workflow .github/workflows/test.yml triggers on push + PR + workflow_dispatch — covers unit (vitest) + e2e (Playwright) + production build with stub Supabase env. README.md added at repo root with CI badge linking to Actions tab.',
    updated_at = now()
where slug = 'p1-ci-active' and done = false;


-- ======================================================================
-- 011_mvp_progress.sql
-- ======================================================================
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


-- ======================================================================
-- 012_mvp_progress.sql
-- ======================================================================
-- Mark p1-og-verify done.
-- Run after 011. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'OG image rewritten — brand-aligned (navy bg, cyan-blue gradient text + brand-mark, gold accent on INR). Sources prices from lib/pricing.ts. Edge runtime, 1200x630 PNG, cached 1yr immutable. /opengraph-image returns 200 with correct image/png content-type. Twitter card = summary_large_image, alt text + locale en_IN. Theme color now #05070F (brand navy) so mobile browser chrome matches backdrop. To re-verify after launch: paste www.easytradesetup.com into linkedin.com/post-inspector + developers.facebook.com/tools/debug + cards-dev.twitter.com/validator.',
    updated_at = now()
where slug = 'p1-og-verify' and done = false;


-- ======================================================================
-- 013_mvp_progress.sql
-- ======================================================================
-- Mark p3-csv-export done.
-- Run after 012. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'GET /api/admin/customers/export streams customers + entitlement-join as RFC 4180 CSV with UTF-8 BOM (Excel auto-detects encoding). Auth: getUser + isAdmin gate; 401/403 on miss. Filename: ets-customers-YYYY-MM-DD.csv via Content-Disposition. Columns: user_id, email, name, signed_up_at, license_active, granted_at, source. Export button on /admin/customers topbar with download attribute.',
    updated_at = now()
where slug = 'p3-csv-export' and done = false;


-- ======================================================================
-- 014_mvp_progress.sql
-- ======================================================================
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


-- ======================================================================
-- 015_mvp_progress.sql
-- ======================================================================
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


-- ======================================================================
-- 016_mvp_progress.sql
-- ======================================================================
-- Mark p4-sentry done.
-- Run after 015. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Sentry SDK wired: @sentry/nextjs installed; configs at sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts; instrumentation.ts registers per-runtime + onRequestError. next.config.mjs wraps with withSentryConfig only when DSN env present (no overhead in local dev). Tunnel route /monitoring added to middleware passthrough so ad-blockers do not strip browser-side reports. Required env: NEXT_PUBLIC_SENTRY_DSN (client + server). Optional: SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN (for source-map upload). Replay + tracing intentionally off (sample rate 0) — pure error capture for now. Errors filter: ResizeObserver noise, ad-blocker fetches, browser-extension sources.',
    updated_at = now()
where slug = 'p4-sentry' and done = false;


-- ======================================================================
-- 017_mvp_progress.sql
-- ======================================================================
-- Surface Sentry inside admin (single-pane goal — never leave admin).
-- Run after 016. Idempotent.

-- p4-sentry note updated to reflect the in-admin dashboard.
update mvp_tasks
set note = 'Sentry SDK wired (commit 9cbf026) PLUS in-admin dashboard at /admin/errors (commit pending). lib/sentry-client.ts hits Sentry REST API server-side with SENTRY_API_TOKEN; surfaces unresolved-issue list, 24h event count, level-coded chips, deep links to Sentry only for stack-trace drilldown. 60s server-side cache. Required env: NEXT_PUBLIC_SENTRY_DSN (write) + SENTRY_API_TOKEN (read). Optional: SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN (source maps).',
    updated_at = now()
where slug = 'p4-sentry';


-- ======================================================================
-- 018_mvp_progress.sql
-- ======================================================================
-- Mark p4-botid done.
-- Run after 017. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Vercel BotID wired: botid npm package, withBotId in next.config wraps the build, BotIdClient mounted on /checkout, checkBotId() server-side check at top of POST /api/lead before rate-limit / DB / Resend. isBot=true returns silent fake-success (303 → /thank-you OR JSON ok=true) so attackers can not fingerprint the filter. Falls through gracefully when BotID env missing (local dev) — other defenses (rate-limit, honeypot) still apply. Activate in Vercel dashboard: Project → Settings → BotID → Enable for the protected routes.',
    updated_at = now()
where slug = 'p4-botid' and done = false;


-- ======================================================================
-- 019_stripe.sql
-- ======================================================================
-- Stripe payment integration: track session, customer, and exact amount on
-- each entitlement, plus a small idempotency table so the webhook never
-- double-fulfils when Stripe retries the same event.id.
--
-- Run after 018. Idempotent — safe to re-apply if the columns already exist.

alter table entitlements
  add column if not exists stripe_session_id  text,
  add column if not exists stripe_customer_id text,
  add column if not exists amount_cents       integer,
  add column if not exists currency           text;

create unique index if not exists entitlements_stripe_session_uniq
  on entitlements (stripe_session_id)
  where stripe_session_id is not null;

create index if not exists entitlements_stripe_customer_idx
  on entitlements (stripe_customer_id)
  where stripe_customer_id is not null;

-- Webhook idempotency. Stripe redelivers events for up to 3 days on
-- non-2xx responses; this table makes the handler idempotent across
-- retries even when the entitlement upsert succeeds but the rest of
-- the handler later 500s.
create table if not exists stripe_events (
  id          text        primary key,
  received_at timestamptz not null default now()
);

alter table stripe_events enable row level security;
-- Service-role writes only. No client-facing select policy needed.

-- ---- MVP backlog flip ------------------------------------------------------
update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Stripe USD payments live: stripe SDK + /api/stripe/checkout (Checkout Session) + /api/webhook/stripe (signature verify, checkout.session.completed grants entitlement, charge.refunded revokes). Webhook idempotent via stripe_events table. Buyer email: Resend HTML + magic-link straight to /portal. Admin notification on every sale. Razorpay (INR) still TODO.',
    updated_at = now()
where slug = 'p0-payments' and done = false;


-- ======================================================================
-- 020_qa_runs.sql
-- ======================================================================
-- QA suite run history. Each run captures version + git SHA + structured
-- check results so the operator can compare "did anything break since the
-- last green run?" without re-running the full suite. results column holds
-- the full CheckResult[] from lib/qa-suite.ts for drill-down.
--
-- Designed to be run after 019. Idempotent.

create table if not exists qa_runs (
  id            uuid        primary key default gen_random_uuid(),
  ran_at        timestamptz not null default now(),
  ran_by        uuid,                       -- auth.users.id of operator who triggered the run
  version       text        not null,       -- package.json version (e.g. "2.0.0")
  git_sha       text,                       -- VERCEL_GIT_COMMIT_SHA (full 40-char) or null for local
  vercel_env    text,                       -- "production" | "preview" | "local"
  origin        text,                       -- request origin used for HTTP probes
  duration_ms   integer     not null,
  total         integer     not null,
  passed        integer     not null,
  warned        integer     not null,
  failed        integer     not null,
  results       jsonb       not null        -- CheckResult[] payload
);

create index if not exists qa_runs_ran_at_idx on qa_runs (ran_at desc);
create index if not exists qa_runs_git_sha_idx on qa_runs (git_sha) where git_sha is not null;

alter table qa_runs enable row level security;
-- Service-role writes only. Admin reads go through the admin route handlers.

-- ---- MVP backlog --------------------------------------------------------
-- Insert a tracking row so the QA gate is visible alongside other go-live items.
-- Idempotent via slug guard. Slug uses p0- prefix to surface in the top tier.
insert into mvp_tasks (slug, tier, position, title, detail, done, done_at, done_by, note)
values (
  'p0-qa-suite',
  'P0',
  99,
  'Comprehensive QA suite + admin dashboard',
  'Pre-deploy go-live readiness gate.',
  true,
  now(),
  'system · auto',
  'Admin → QA: 50+ checks across Build/Env/Security/Functional/SEO/DB/Pricing/UX. Runs persist to qa_runs with version + git SHA so regressions are diffable across deploys.'
)
on conflict (slug) do update
set done = true,
    done_at = coalesce(mvp_tasks.done_at, now()),
    note = excluded.note,
    updated_at = now();


-- ======================================================================
-- 021_soft_delete.sql
-- ======================================================================
-- Soft-delete on entitlements. Revoke flow no longer hard-deletes the
-- row — flips active=false, stamps revoked_at + revoked_by + revoke_reason.
-- Recoverable in one click; auditable forever; no data loss from operator
-- mis-clicks.
--
-- Existing revoke history (pre-021 hard-deletes) is unrecoverable — only
-- new revokes from here on are soft-deleted.
--
-- Run after 020. Idempotent.

alter table entitlements
  add column if not exists revoked_at     timestamptz,
  add column if not exists revoked_by     uuid,
  add column if not exists revoke_reason  text;

create index if not exists entitlements_revoked_at_idx
  on entitlements (revoked_at)
  where revoked_at is not null;

-- ---- MVP backlog --------------------------------------------------------
insert into mvp_tasks (slug, tier, position, title, detail, done, done_at, done_by, note)
values (
  'p3-soft-delete-entitlements',
  'P3',
  99,
  'Soft-delete entitlements (recoverable revoke)',
  'Revoke flow stamps revoked_at + revoked_by instead of dropping the row.',
  true,
  now(),
  'system · auto',
  'Migration 021 added revoked_at/revoked_by/revoke_reason columns. /api/admin/entitlement-revoke now flips active=false and stamps the audit fields. Hard-delete kept behind ?hard=1 query for cases where the row truly should not exist (test data leaks, etc.).'
)
on conflict (slug) do update
set done = true,
    done_at = coalesce(mvp_tasks.done_at, now()),
    note = excluded.note,
    updated_at = now();


-- ======================================================================
-- 022_launch_readiness.sql
-- ======================================================================
-- Launch-readiness acknowledgements. The /admin/readiness page maintains
-- the canonical checklist in code (lib/launch-readiness.ts) and uses this
-- table only to record operator acks for items that can't be auto-detected
-- (founder bio, 2FA enabled, staging env wired, backup-restore drilled,
-- INR live charge tested, etc).
--
-- A row in this table = "operator confirmed this item is done." Items with
-- auto-detect functions don't need acks; their live status comes from the
-- environment / DB schema.
--
-- Run after 021. Idempotent.

create table if not exists launch_readiness_acks (
  slug       text        primary key,
  acked_at   timestamptz not null default now(),
  acked_by   uuid,
  note       text
);

alter table launch_readiness_acks enable row level security;
-- Service-role writes only. Admin reads go through route handlers.

-- ---- MVP backlog --------------------------------------------------------
insert into mvp_tasks (slug, tier, position, title, detail, done, done_at, done_by, note)
values (
  'p0-launch-readiness',
  'P0',
  98,
  'Launch readiness checklist (admin)',
  'Pre-prod gate covering blockers + warnings.',
  true,
  now(),
  'system · auto',
  'Migration 022 added launch_readiness_acks table. /admin/readiness renders all blockers + warnings with live auto-detect (Stripe key mode, migration applied, env vars, etc.) and manual-ack flow for items that can only be confirmed by the operator.'
)
on conflict (slug) do update
set done = true,
    done_at = coalesce(mvp_tasks.done_at, now()),
    note = excluded.note,
    updated_at = now();


-- ======================================================================
-- 023_uptime.sql
-- ======================================================================
-- Site uptime + endpoint health pings. One row per cron firing × URL probed.
-- Read by /admin/site-health to surface uptime + latency without leaving
-- the admin panel. Old rows pruned on read past 30 days.

create table if not exists public.uptime_pings (
  id            bigserial primary key,
  url           text not null,
  status        integer not null,           -- HTTP status code, 0 if connect fail
  ok            boolean not null,           -- true if 200..399
  latency_ms    integer not null,
  error         text,                       -- error message on failure (truncated to 200 chars)
  ran_at        timestamptz not null default now()
);

create index if not exists uptime_pings_url_ran_at_idx
  on public.uptime_pings (url, ran_at desc);

create index if not exists uptime_pings_ran_at_idx
  on public.uptime_pings (ran_at desc);

-- Service role inserts (cron route). Admins read via SECURITY DEFINER
-- query in the page handler — no client-side reads needed, RLS denies
-- everything else.
alter table public.uptime_pings enable row level security;


-- ======================================================================
-- 024_marketing_tasks.sql
-- ======================================================================
-- Marketing checklist — durable backlog for the post-launch motion.
-- Mirrors mvp_tasks (007) shape so admin UI can reuse the TaskCheckbox
-- + toggle pattern. Tier scheme is M0-M5 instead of P0-P5.
--
-- Frozen-list rule (same as mvp_tasks): app code only toggles done
-- and edits notes; the canonical task list lives here in migrations.

create table if not exists marketing_tasks (
  slug          text        primary key,
  tier          text        not null check (tier in ('M0','M1','M2','M3','M4','M5')),
  position      integer     not null,
  title         text        not null,
  detail        text,
  link          text,                          -- optional outbound link (e.g. tool signup)
  done          boolean     not null default false,
  done_at       timestamptz,
  done_by       text,
  note          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists marketing_tasks_tier_idx on marketing_tasks (tier, position);

alter table marketing_tasks enable row level security;
create policy "no anon access to marketing_tasks"
  on marketing_tasks for all using (false) with check (false);

-- Seed: post-launch marketing motion. Tiers grouped by leverage:
--   M0 — pre-launch one-time setup that gates everything else
--   M1 — content engine (week 1)
--   M2 — distribution cadence (ongoing)
--   M3 — programmatic SEO + email nurture
--   M4 — analytics + optimization
--   M5 — paid acquisition (only after organic baseline)
insert into marketing_tasks (slug, tier, position, title, detail, link) values
  -- ============ M0 — pre-launch setup ============
  ('m0-stripe-live',        'M0', 1, 'Verify Stripe sk_live_ on Vercel + run a real test purchase',
   'Test from a separate account. Confirm: webhook fires, entitlement row inserts, magic link emails, portal unlocks.', null),
  ('m0-resend-domain',      'M0', 2, 'Confirm Resend DKIM + SPF green for easytradesetup.com',
   'Send a test from welcome@. Check inbox + spam in Gmail, Outlook, Yahoo.', 'https://resend.com/domains'),
  ('m0-uptime-cron',        'M0', 3, 'Wire cron-job.org to ping /api/cron/uptime every 5min',
   'Bearer header: $CRON_SECRET. URL: https://www.easytradesetup.com/api/cron/uptime', 'https://cron-job.org'),
  ('m0-search-console',     'M0', 4, 'Submit sitemap to Google Search Console',
   'sitemap URL: https://www.easytradesetup.com/sitemap.xml. Verify ownership via meta tag (env: GOOGLE_SITE_VERIFICATION).', 'https://search.google.com/search-console'),
  ('m0-ga4',                'M0', 5, 'Set up Google Analytics 4 property + paste measurement ID',
   'Already have Vercel Analytics + Microsoft Clarity. GA4 is the SEO tracker advertisers and Search Console expect.', 'https://analytics.google.com'),
  ('m0-bing-webmaster',     'M0', 6, 'Submit sitemap to Bing Webmaster Tools',
   'Bing serves Yahoo + DuckDuckGo organic. ~5min. env: BING_SITE_VERIFICATION.', 'https://www.bing.com/webmasters'),
  ('m0-founder-photo',      'M0', 7, 'Replace placeholder with real founder photo + bio on /about',
   'Trust signal. Square crop, ~800x800. Real name, year started trading, why you built this.', null),

  -- ============ M1 — content engine, week 1 ============
  ('m1-yt-channel',         'M1', 1, 'Create YouTube channel "EasyTradeSetup" with banner + about',
   'Upload chart-after.png as banner. About section: indicator + course + free risk calc. Link to easytradesetup.com.', 'https://youtube.com/create_channel'),
  ('m1-x-account',          'M1', 2, 'Set up X / Twitter account @easytradesetup',
   'Pinned tweet: thread #1 from playbook. Profile pic = brand mark. Bio: trader voice, link.', 'https://x.com'),
  ('m1-typefully',          'M1', 3, 'Sign up for Typefully — schedule 30 days of X content',
   'Free tier covers 1 thread queue. Paid ($15/mo) unlocks analytics.', 'https://typefully.com'),
  ('m1-linkedin',           'M1', 4, 'Set up LinkedIn page + first 3 posts',
   'India IT/finance professionals do intraday. Voice: more measured than X.', 'https://linkedin.com/company/setup'),
  ('m1-thread-1',           'M1', 5, 'Publish X thread #1 — "I built a Pine v5 indicator. Here is what is inside."',
   '10 tweets. Hook: most indicators give one thing, mine fuses 6 layers. End: free risk calc + sample setup link.', null),
  ('m1-yt-video-1',         'M1', 6, 'Record + publish YouTube video #1 — "I tested 5 free TradingView indicators on NIFTY"',
   '12min. Show win/loss tally on screen. Reveal Lifeline at 8min. CTA: free risk calc + samples.', null),
  ('m1-reddit-post',        'M1', 7, 'Post on r/StockMarketIndia — "Built a NIFTY indicator after losing on 30+ subscription tools"',
   'Read sub rules first. No spam karma allowed. Value first, link last. Be ready to answer comments.', 'https://reddit.com/r/StockMarketIndia'),
  ('m1-hindi-tagline',      'M1', 8, 'Verify Hindi tagline still on TrustStrip post-launch',
   'India-first signal. Already shipped. Just confirm rendered correctly on mobile.', null),

  -- ============ M2 — ongoing distribution cadence ============
  ('m2-x-daily',            'M2', 1, 'Daily X post — 1 setup recap or chart insight',
   '5 days/week minimum. Use Typefully queue. Theme: yesterday is plot, today is plan.', null),
  ('m2-x-thread-weekly',    'M2', 2, 'Weekly X thread on a setup or rule (10 tweets)',
   'Tuesday morning IST. Rotate: Lifeline / Magnetic Zone / signal psychology / risk firewall.', null),
  ('m2-yt-weekly',          'M2', 3, 'YouTube — 1 video/week, ~10-15min',
   'Topics: setup walkthroughs, comparison videos, "I tested" formats. End screen pushes free sample.', null),
  ('m2-reddit-weekly',      'M2', 4, 'Reddit — 1 high-value post + 5 comments per week',
   'r/IndianStreetBets (intraday focus), r/StockMarketIndia, r/tradingview. Karma first, link later.', null),
  ('m2-linkedin-3x',        'M2', 5, 'LinkedIn — 3 posts/week (Mon/Wed/Fri)',
   'Frame for finance professionals. Less casual than X. Story + lesson + link.', null),
  ('m2-tg-channel',         'M2', 6, 'Optional: Telegram broadcast channel (NOT a group)',
   'Channel only — no community moderation burden. Daily 1 chart post with Lifeline annotation. Free, builds list.', 'https://telegram.org'),

  -- ============ M3 — SEO + email nurture ============
  ('m3-prog-seo-extend',    'M3', 1, 'Add 6 more programmatic /indicator/[market] pages',
   'Templates: reliance, tcs, hdfc (NSE singles), silver, crude (commodities), eth, sol (crypto). 30min batch.', null),
  ('m3-blog-section',       'M3', 2, 'Add /blog with first 3 SEO-optimised posts',
   'Posts: "How to read CPR on NIFTY", "Lifeline vs 200 EMA", "Why most TradingView signals repaint". Each 1500+ words.', null),
  ('m3-email-day0',         'M3', 3, 'Resend template — Day 0 welcome email',
   'Already wired in /api/lead. Verify content matches latest brand voice + free sample link.', null),
  ('m3-email-day3',         'M3', 4, 'Resend template + cron — Day 3 nurture email',
   '"Why I built Golden Indicator" — story + pain. Schedule via Resend cron or Supabase row + cron job.', null),
  ('m3-email-day7',         'M3', 5, 'Resend template + cron — Day 7 nurture email',
   '"5 setups inside the indicator — pick yours" — value reveal.', null),
  ('m3-email-day14',        'M3', 6, 'Resend template + cron — Day 14 nurture email',
   'Soft-scarcity reminder: lifetime price still active. No fake urgency.', null),
  ('m3-twelve-data',        'M3', 7, 'Wire Twelve Data API key for live quotes ticker',
   'Hero ticker upgrade. env: TWELVE_DATA_API_KEY. Free tier: 800 reqs/day = enough for ticker rotation.', 'https://twelvedata.com'),

  -- ============ M4 — analytics + optimization ============
  ('m4-clarity-funnel',     'M4', 1, 'Set up conversion funnel in Microsoft Clarity',
   'Funnel: home -> sample -> checkout -> thank-you. Watch where users drop.', 'https://clarity.microsoft.com'),
  ('m4-utm-discipline',     'M4', 2, 'Tag every external campaign URL with UTM params',
   'utm_source=twitter / utm_medium=thread / utm_campaign=launch-week-1. Spreadsheet of templates.', null),
  ('m4-conversion-target',  'M4', 3, 'Set target: 3% lead-to-purchase, 0.5% visitor-to-purchase',
   'Standard SaaS-with-trial benchmarks. If below at month 2, optimise pricing page.', null),
  ('m4-ab-pricing',         'M4', 4, 'A/B test: ₹4,599 vs ₹3,999 vs ₹5,499',
   'Wait until 100+ purchases for statistical significance. Vercel Edge Config + cookie-based split.', null),

  -- ============ M5 — paid acquisition ============
  ('m5-google-search',      'M5', 1, 'Google Search ads — long-tail keywords',
   '"nifty intraday strategy", "tradingview pine indicator", "best banknifty indicator". Start ₹500/day. Watch CAC.', 'https://ads.google.com'),
  ('m5-meta-retarget',      'M5', 2, 'Meta retargeting — visitors who saw /sample but did not buy',
   'Audience: site-visitors-no-purchase, last 30 days. Creative: "You read the sample. Now read the rest."', 'https://business.facebook.com'),
  ('m5-x-promoted',         'M5', 3, 'X promoted thread — best-performing organic thread first',
   'Cheaper than Meta for trader audience. Boost the thread that already worked organically.', null),
  ('m5-affiliate-program',  'M5', 4, 'Set up affiliate program — 30% lifetime commission',
   'One-time payout structure (since product is one-time). Tools: Rewardful, Trolley, or DIY in Stripe.', 'https://rewardful.com')
on conflict (slug) do nothing;


-- ======================================================================
-- 025_marketing_tasks_simplified.sql
-- ======================================================================
-- Simplified marketing checklist for solo, AI-first founder.
-- Replaces the 024 seed. Optimised for minimum manual time:
--   * AI writes drafts (Claude / ChatGPT free tier)
--   * Free schedulers run distribution (Typefully free, Buffer free)
--   * Programmatic SEO + email drips set up once, harvest for years
-- Dropped from 024: paid acquisition (M5), daily cadence, A/B pricing,
-- affiliate program, Twelve Data live quotes — none are leverage for
-- a one-person operation pre-100-customer mark.
--
-- Tier scheme tightened to M0-M4. Re-running this file is idempotent.

-- 1. Wipe prior seed FIRST. Required before tightening the tier
--    constraint — any leftover M5 rows would violate the new check.
--    If you'd already ticked tasks under 024, jot them down before
--    running this file (slugs are rewritten to match new framing).
delete from marketing_tasks;

-- 2. Tighten tier constraint to M0-M4 (M5 dropped).
alter table marketing_tasks drop constraint if exists marketing_tasks_tier_check;
alter table marketing_tasks add constraint marketing_tasks_tier_check
  check (tier in ('M0','M1','M2','M3','M4'));

insert into marketing_tasks (slug, tier, position, title, detail, link) values

  -- ============ M0 — Foundation (one-time, gates everything) ============
  ('m0-stripe-live',        'M0', 1, 'Verify Stripe sk_live_ on Vercel + run a real test purchase',
   'Test from a separate account. Confirm: webhook fires, entitlement row inserts, magic link emails, portal unlocks.', null),
  ('m0-resend-domain',      'M0', 2, 'Confirm Resend DKIM + SPF green for easytradesetup.com',
   'Send a test from welcome@. Check inbox + spam in Gmail, Outlook, Yahoo.', 'https://resend.com/domains'),
  ('m0-uptime-cron',        'M0', 3, 'Wire cron-job.org to ping /api/cron/uptime every 5min',
   'Bearer header: $CRON_SECRET. URL: https://www.easytradesetup.com/api/cron/uptime', 'https://cron-job.org'),
  ('m0-search-console',     'M0', 4, 'Submit sitemap to Google Search Console',
   'sitemap URL: https://www.easytradesetup.com/sitemap.xml. Verify ownership via meta tag (env: GOOGLE_SITE_VERIFICATION).', 'https://search.google.com/search-console'),
  ('m0-ga4',                'M0', 5, 'Set up Google Analytics 4 + paste measurement ID',
   'Already have Vercel Analytics + Microsoft Clarity. GA4 is the SEO tracker advertisers and Search Console expect.', 'https://analytics.google.com'),
  ('m0-bing-webmaster',     'M0', 6, 'Submit sitemap to Bing Webmaster Tools',
   'Bing serves Yahoo + DuckDuckGo organic. ~5min. env: BING_SITE_VERIFICATION.', 'https://www.bing.com/webmasters'),
  ('m0-founder-photo',      'M0', 7, 'Replace placeholder with real founder photo + bio on /about',
   'Trust signal. Square crop ~800x800. Real name, year started trading, why you built this.', null),

  -- ============ M1 — AI content factory (one-time setup) ============
  -- Goal: spend one weekend wiring the assembly line, then weekly batches feed it.
  ('m1-yt-channel',         'M1', 1, 'Create YouTube channel "EasyTradeSetup" + banner + about',
   'Banner: chart-after.png. About: indicator + course + free risk calc. Link easytradesetup.com.', 'https://youtube.com/create_channel'),
  ('m1-x-account',          'M1', 2, 'Set up X / Twitter @easytradesetup',
   'Profile pic = brand mark. Bio: trader voice + link. Pinned tweet later (M1 task).', 'https://x.com'),
  ('m1-linkedin-page',      'M1', 3, 'Set up LinkedIn personal post-handle (no separate page needed)',
   'India IT/finance professionals do intraday. Post from your personal handle — more reach than a brand page early on.', 'https://linkedin.com'),
  ('m1-typefully',          'M1', 4, 'Sign up Typefully (free tier) for X scheduling',
   'Free covers 1 thread queue + scheduled single posts. Drafts + queue.', 'https://typefully.com'),
  ('m1-buffer',             'M1', 5, 'Sign up Buffer (free tier) for LinkedIn scheduling',
   'Free: 10 scheduled posts per channel. Enough for 2-3 weeks of LinkedIn at our cadence.', 'https://buffer.com'),
  ('m1-prompt-library',     'M1', 6, 'Save 5 reusable AI prompt templates in Notion / Google Doc',
   'Templates: X post, X thread, LinkedIn post, YouTube script, blog post. Each template ends with brand voice + CTA rules. Reuse weekly.', null),
  ('m1-batch-1',            'M1', 7, 'AI-generate first batch — 30 X posts + 10 LinkedIn posts + schedule them',
   'Spend 1-2 hours with Claude / ChatGPT. Paste prompt template, ask for 30 variants, edit lightly, paste into Typefully + Buffer queues. Auto-publishes for 3-4 weeks.', null),
  ('m1-pinned-tweet',       'M1', 8, 'Pin first X thread once published (M2 step makes it).',
   'Pinned thread = best converter for new visitors. Refresh whenever a new thread outperforms.', null),

  -- ============ M2 — Automated distribution (weekly 30min batches) ============
  -- Goal: one focused 30-min sprint per week tops up the queues.
  ('m2-weekly-x-batch',     'M2', 1, 'Weekly 30min — AI-generate 5-7 X posts + queue in Typefully',
   'Sunday morning. Reuse prompt template. Theme rotates: setup recap / rule of thumb / risk lesson / chart of the week.', null),
  ('m2-weekly-li-batch',    'M2', 2, 'Weekly 30min — AI-generate 2-3 LinkedIn posts + queue in Buffer',
   'Same Sunday slot. Frame for finance professionals: less casual, more "lessons learned" tone.', null),
  ('m2-monthly-thread',     'M2', 3, 'Monthly — 1 X thread (AI draft, you edit, publish)',
   'First Tuesday of the month. 10 tweets. Topics: Lifeline rules / Magnetic Zone / signal psychology / risk firewall.', null),
  ('m2-monthly-yt',         'M2', 4, 'Monthly — 1 YouTube video (AI script + screen recording, ~10min)',
   'Last weekend of month. Topics: setup walkthrough / "I tested X indicators" / strategy of the month.', null),
  ('m2-monthly-reddit',     'M2', 5, 'Monthly — 1 Reddit post (AI draft, you edit for sub voice, publish)',
   'r/StockMarketIndia or r/IndianStreetBets or r/tradingview. Read sub rules first. Value-first — link in body, not title.', 'https://reddit.com/r/StockMarketIndia'),

  -- ============ M3 — SEO autopilot (one-time + drips) ============
  -- Goal: set up once, harvests organic traffic for years with zero ongoing time.
  ('m3-prog-seo-extend',    'M3', 1, 'Add 6 more programmatic /indicator/[market] pages',
   'Templates: reliance, tcs, hdfc (NSE singles), silver, crude (commodities), eth, sol (crypto). 30min batch — AI fills the per-market copy.', null),
  ('m3-blog-section',       'M3', 2, 'Add /blog with 5 AI-drafted SEO posts',
   'Topics: "How to read CPR on NIFTY", "Lifeline vs 200 EMA", "Why most TradingView signals repaint", "Risk-first intraday playbook", "What we learned from 100 NIFTY trades". Each 1500+ words. Edit AI drafts for voice.', null),
  ('m3-email-day0',         'M3', 3, 'Resend Day 0 welcome email — verify content',
   'Already wired in /api/lead. Confirm copy matches latest brand voice + free sample link.', null),
  ('m3-email-day3',         'M3', 4, 'Resend Day 3 nurture email — "Why I built Golden Indicator"',
   'AI-draft the founder story. Pain → product → free sample CTA. Schedule via Resend cron or Supabase row + cron-job.org.', null),
  ('m3-email-day7',         'M3', 5, 'Resend Day 7 nurture email — "5 setups inside the indicator, pick yours"',
   'Value reveal. Lifeline / Magnetic Zone / VWAP / CPR / Volume Burst — one paragraph each. CTA: full course unlocks on purchase.', null),
  ('m3-email-day14',        'M3', 6, 'Resend Day 14 nurture email — soft-scarcity reminder',
   'Lifetime price still active. No fake countdown. Just a one-liner reminder + last call to grab launch pricing.', null),
  ('m3-nurture-cron',       'M3', 7, 'Wire the Day 3/7/14 emails to fire automatically',
   'Pattern: lead row stores created_at; nightly cron-job.org pings /api/cron/nurture; route picks rows where (now - created_at) crossed Day 3/7/14 boundary in last 24h. One-time wiring.', 'https://cron-job.org'),

  -- ============ M4 — Measure + iterate (lightweight) ============
  ('m4-clarity-funnel',     'M4', 1, 'Set up conversion funnel in Microsoft Clarity',
   'Funnel: home -> sample -> checkout -> thank-you. Watch heatmaps + dropoffs. Free, no SDK changes (Clarity already wired).', 'https://clarity.microsoft.com'),
  ('m4-utm-discipline',     'M4', 2, 'UTM-tag every external campaign URL',
   'utm_source=twitter / utm_medium=thread / utm_campaign=launch. Save a Google Doc with templates so you copy-paste.', null),
  ('m4-weekly-search',      'M4', 3, 'Weekly 5min — check Search Console top queries',
   'Sunday after the content batch. Note which queries are trending up. Feed those into the next month''s blog topics.', null),
  ('m4-monthly-review',     'M4', 4, 'Monthly 30min — review which /indicator + /blog pages convert best',
   'Use Clarity + GA4. Double down on the winners (more programmatic variants). Kill or rewrite the losers.', null),
  ('m4-conversion-target',  'M4', 5, 'Set + track conversion target: 3% lead→buy, 0.5% visit→buy',
   'Standard SaaS-with-trial benchmarks. Below at month 2? Optimise pricing page or sample page first — they''re the highest-leverage edits.', null)

on conflict (slug) do nothing;


-- ======================================================================
-- 026_marketing_tasks_yt_ig.sql
-- ======================================================================
-- Narrow M1 + M2 to YouTube + Instagram only.
-- Founder explicitly opted out of X / Twitter, LinkedIn, Reddit
-- distribution. YT + IG = visual-first, single-content-pipeline,
-- both schedulable from Meta Business Suite (free) + YouTube Studio
-- without third-party tooling.
--
-- Drops: Typefully, Buffer, X account / posts, LinkedIn personal,
--        Reddit posts, pinned X thread.
-- Keeps: YouTube channel + monthly video + weekly short.
-- Adds:  Instagram account, weekly IG batch, IG reel cadence.

-- Re-seed M1 + M2 only. M0 / M3 / M4 untouched.
delete from marketing_tasks where tier in ('M1','M2');

insert into marketing_tasks (slug, tier, position, title, detail, link) values

  -- ============ M1 — AI content factory (YouTube + Instagram only) ============
  ('m1-yt-channel',         'M1', 1, 'Create YouTube channel "EasyTradeSetup" + banner + about',
   'Banner: chart-after.png. About: indicator + course + free risk calc. Link easytradesetup.com.', 'https://youtube.com/create_channel'),
  ('m1-ig-account',         'M1', 2, 'Set up Instagram @easytradesetup business account',
   'Pick "Business" account type so Meta Business Suite scheduling works. Profile pic = brand mark. Bio: trader voice + link in bio (use Linktree free or direct site link).', 'https://www.instagram.com/accounts/emailsignup/'),
  ('m1-meta-business-suite','M1', 3, 'Connect Instagram to Meta Business Suite (free scheduler)',
   'business.facebook.com → claim IG account. Native Meta scheduler — no Buffer / Typefully needed. Schedules feed posts, reels, stories.', 'https://business.facebook.com'),
  ('m1-prompt-library',     'M1', 4, 'Save 3 reusable AI prompt templates in Notion / Google Doc',
   'Templates: (1) IG carousel — 5-10 slides, hook on slide 1, value on 2-N, CTA on last. (2) IG reel script — 30-60s, hook in 2s. (3) YouTube long-form script — 8-12min outline. Each ends with brand voice + CTA rules. Reuse weekly.', null),
  ('m1-batch-1',            'M1', 5, 'AI-generate first batch — 10 IG carousels + 5 IG reels + schedule them',
   'Spend 1-2 hours with Claude / ChatGPT. Paste prompt template, ask for 10 carousel topics + 5 reel scripts, edit lightly. Schedule via Meta Business Suite — auto-publishes for 3-4 weeks of IG.', null),
  ('m1-yt-short-batch',     'M1', 6, 'Record + queue 3 YouTube Shorts (60s each)',
   'Phone vertical. Topics: "What is Lifeline?", "Free risk calc walkthrough", "Why most TradingView signals repaint". Upload via YT Studio with scheduled publish dates over next 3 weeks.', 'https://studio.youtube.com'),

  -- ============ M2 — Automated distribution (weekly 30min) ============
  ('m2-weekly-ig-batch',    'M2', 1, 'Weekly 30min — AI-generate 3 IG posts (2 carousels + 1 reel) + queue in Meta Business Suite',
   'Sunday morning. Reuse prompt templates from M1. Theme rotates: setup recap / rule of thumb / risk lesson / chart of the week.', 'https://business.facebook.com'),
  ('m2-weekly-yt-short',    'M2', 2, 'Weekly — 1 YouTube Short (60s, repurpose the week''s best IG reel)',
   '5min effort: re-export the IG reel without watermark, upload to YT Studio. Same content, second platform, zero extra creative time.', 'https://studio.youtube.com'),
  ('m2-monthly-yt-long',    'M2', 3, 'Monthly — 1 YouTube long-form video (8-12min)',
   'Last weekend of month. Topics: setup walkthrough / "I tested X indicators" / strategy of the month. AI script + screen recording (OBS / Loom free tier).', null),
  ('m2-monthly-ig-story',   'M2', 4, 'Monthly — 1 Instagram Story highlight reel update',
   'Stories show on profile as pinned highlights ("Setups", "Course", "Free Tools"). Update once a month. 5min effort. Drives profile-visit conversion.', null)

on conflict (slug) do nothing;


-- ======================================================================
-- 027_content_posts.sql
-- ======================================================================
-- Content publishing queue. Each row = one Instagram post we'll auto-publish.
-- Reels are not in scope here — Opus Clip handles those. This table covers
-- IG static + carousel posts that the daily Vercel cron pulls + publishes.
--
-- Tracks: which post is up next, what got published, what failed, and what
-- Meta returned (so we can link back to the live post for analytics later).
--
-- Source data is the 14-day-queue.json file under admin-assets/content/. The
-- /api/admin/content-posts/sync route imports new rows from JSON without
-- overwriting status of already-published rows (idempotent re-sync).

create table if not exists content_posts (
  id              uuid primary key default gen_random_uuid(),

  -- Identity within the queue. day is unique so re-syncing the same JSON
  -- row updates instead of inserting duplicates.
  day             integer not null unique,
  date            date,

  -- Post content. caption is the full pre-formatted text the cron pastes.
  -- image_prompt drives the OG image renderer when no manual asset is set.
  platform        text not null default 'instagram'
                    check (platform in ('instagram')),
  format          text not null
                    check (format in ('static','carousel','reel')),
  hook            text not null,
  caption         text not null,
  image_prompt    text,
  cta             text,
  keyword_target  text,
  slide_outline   jsonb default '[]'::jsonb,
  duration_seconds integer,

  -- Scheduling + status machine.
  scheduled_at    timestamptz,
  status          text not null default 'pending'
                    check (status in ('pending','publishing','published','failed','skipped')),

  -- Result fields populated after a publish attempt.
  ig_media_id     text,
  ig_permalink    text,
  error_message   text,
  attempts        integer not null default 0,
  published_at    timestamptz,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists content_posts_status_idx on content_posts(status);
create index if not exists content_posts_scheduled_idx on content_posts(scheduled_at);

-- Auto-update updated_at on row change.
create or replace function content_posts_touch() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists content_posts_touch on content_posts;
create trigger content_posts_touch
  before update on content_posts
  for each row execute function content_posts_touch();

-- RLS: service-role-only. Admin pages read via service role; cron runs server-side.
alter table content_posts enable row level security;

drop policy if exists "service role full access" on content_posts;
create policy "service role full access" on content_posts
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');


-- ======================================================================
-- 028_content_posts_youtube.sql
-- ======================================================================
-- Add YouTube publishing fields to content_posts. Same row covers both
-- IG and YT publishing — separate ig_* and yt_* columns track each pipeline
-- independently, so a post can be live on IG but pending on YT (or vice
-- versa, or stuck on one but not the other).
--
-- Status fields are split because IG and YT can fail / succeed separately.
-- Cron routes only check + update their own platform's columns.

alter table content_posts
  add column if not exists yt_status        text not null default 'pending'
    check (yt_status in ('pending','publishing','published','failed','skipped')),
  add column if not exists yt_video_id      text,
  add column if not exists yt_url           text,
  add column if not exists yt_error_message text,
  add column if not exists yt_attempts      integer not null default 0,
  add column if not exists yt_published_at  timestamptz;

create index if not exists content_posts_yt_status_idx on content_posts(yt_status);

-- For posts that already exist (already-synced IG queue), default yt_status
-- to 'pending' so the YT cron picks them up. The DEFAULT 'pending' on the
-- column handles new rows; this UPDATE handles existing ones.
update content_posts set yt_status = 'pending' where yt_status is null;

