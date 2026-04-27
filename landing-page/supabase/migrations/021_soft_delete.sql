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
