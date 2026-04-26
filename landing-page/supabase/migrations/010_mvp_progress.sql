-- Mark p1-ci-active done.
-- Run after 009. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Confirmed via GitHub API: 21 successful runs against main, latest green on commit 19cc7ff. Workflow .github/workflows/test.yml triggers on push + PR + workflow_dispatch — covers unit (vitest) + e2e (Playwright) + production build with stub Supabase env. README.md added at repo root with CI badge linking to Actions tab.',
    updated_at = now()
where slug = 'p1-ci-active' and done = false;
