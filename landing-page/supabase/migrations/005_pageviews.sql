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
