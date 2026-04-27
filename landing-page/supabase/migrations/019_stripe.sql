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
