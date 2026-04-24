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
