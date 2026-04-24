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
