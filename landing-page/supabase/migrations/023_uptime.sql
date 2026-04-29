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
