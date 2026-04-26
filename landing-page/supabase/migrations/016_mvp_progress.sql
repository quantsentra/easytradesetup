-- Mark p4-sentry done.
-- Run after 015. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Sentry SDK wired: @sentry/nextjs installed; configs at sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts; instrumentation.ts registers per-runtime + onRequestError. next.config.mjs wraps with withSentryConfig only when DSN env present (no overhead in local dev). Tunnel route /monitoring added to middleware passthrough so ad-blockers do not strip browser-side reports. Required env: NEXT_PUBLIC_SENTRY_DSN (client + server). Optional: SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN (for source-map upload). Replay + tracing intentionally off (sample rate 0) — pure error capture for now. Errors filter: ResizeObserver noise, ad-blocker fetches, browser-extension sources.',
    updated_at = now()
where slug = 'p4-sentry' and done = false;
