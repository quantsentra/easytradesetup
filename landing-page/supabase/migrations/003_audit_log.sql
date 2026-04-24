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
