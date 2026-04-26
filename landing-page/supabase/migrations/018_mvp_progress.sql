-- Mark p4-botid done.
-- Run after 017. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'Vercel BotID wired: botid npm package, withBotId in next.config wraps the build, BotIdClient mounted on /checkout, checkBotId() server-side check at top of POST /api/lead before rate-limit / DB / Resend. isBot=true returns silent fake-success (303 → /thank-you OR JSON ok=true) so attackers can not fingerprint the filter. Falls through gracefully when BotID env missing (local dev) — other defenses (rate-limit, honeypot) still apply. Activate in Vercel dashboard: Project → Settings → BotID → Enable for the protected routes.',
    updated_at = now()
where slug = 'p4-botid' and done = false;
