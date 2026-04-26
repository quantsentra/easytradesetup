-- Mark backlog items completed so far.
-- Run after 007_mvp_tasks.sql. Idempotent — safe to re-run.
--
-- Discipline rule (carried over from 007): items can only be added or
-- their state changed by migrations. The admin UI can toggle done +
-- note, but seed corrections live here.

-- p0-lead-resend: code shipped in commit 2498e72.
-- Capture pipeline: /api/lead → leads table insert + Resend (welcome
-- email to lead + admin notify). Both DB + email are best-effort so
-- form submission cannot fail on infra hiccups.
update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · 2498e72',
    note = 'Code shipped commit 2498e72. Live after: (1) run 006_leads.sql migration, (2) set RESEND_API_KEY in Vercel env, (3) verify easytradesetup.com domain in Resend then swap LEAD_FROM_EMAIL.',
    updated_at = now()
where slug = 'p0-lead-resend' and done = false;
