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
