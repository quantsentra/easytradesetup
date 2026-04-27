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
