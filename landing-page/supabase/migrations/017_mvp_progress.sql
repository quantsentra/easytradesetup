-- Surface Sentry inside admin (single-pane goal — never leave admin).
-- Run after 016. Idempotent.

-- p4-sentry note updated to reflect the in-admin dashboard.
update mvp_tasks
set note = 'Sentry SDK wired (commit 9cbf026) PLUS in-admin dashboard at /admin/errors (commit pending). lib/sentry-client.ts hits Sentry REST API server-side with SENTRY_API_TOKEN; surfaces unresolved-issue list, 24h event count, level-coded chips, deep links to Sentry only for stack-trace drilldown. 60s server-side cache. Required env: NEXT_PUBLIC_SENTRY_DSN (write) + SENTRY_API_TOKEN (read). Optional: SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN (source maps).',
    updated_at = now()
where slug = 'p4-sentry';
