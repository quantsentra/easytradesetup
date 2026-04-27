-- QA suite run history. Each run captures version + git SHA + structured
-- check results so the operator can compare "did anything break since the
-- last green run?" without re-running the full suite. results column holds
-- the full CheckResult[] from lib/qa-suite.ts for drill-down.
--
-- Designed to be run after 019. Idempotent.

create table if not exists qa_runs (
  id            uuid        primary key default gen_random_uuid(),
  ran_at        timestamptz not null default now(),
  ran_by        uuid,                       -- auth.users.id of operator who triggered the run
  version       text        not null,       -- package.json version (e.g. "2.0.0")
  git_sha       text,                       -- VERCEL_GIT_COMMIT_SHA (full 40-char) or null for local
  vercel_env    text,                       -- "production" | "preview" | "local"
  origin        text,                       -- request origin used for HTTP probes
  duration_ms   integer     not null,
  total         integer     not null,
  passed        integer     not null,
  warned        integer     not null,
  failed        integer     not null,
  results       jsonb       not null        -- CheckResult[] payload
);

create index if not exists qa_runs_ran_at_idx on qa_runs (ran_at desc);
create index if not exists qa_runs_git_sha_idx on qa_runs (git_sha) where git_sha is not null;

alter table qa_runs enable row level security;
-- Service-role writes only. Admin reads go through the admin route handlers.

-- ---- MVP backlog --------------------------------------------------------
-- Insert a tracking row so the QA gate is visible alongside other go-live items.
-- Idempotent via slug guard. Slug uses p0- prefix to surface in the top tier.
insert into mvp_tasks (slug, tier, position, title, detail, done, done_at, done_by, note)
values (
  'p0-qa-suite',
  'P0',
  99,
  'Comprehensive QA suite + admin dashboard',
  'Pre-deploy go-live readiness gate.',
  true,
  now(),
  'system · auto',
  'Admin → QA: 50+ checks across Build/Env/Security/Functional/SEO/DB/Pricing/UX. Runs persist to qa_runs with version + git SHA so regressions are diffable across deploys.'
)
on conflict (slug) do update
set done = true,
    done_at = coalesce(mvp_tasks.done_at, now()),
    note = excluded.note,
    updated_at = now();
