# Operator runbook

Cheat sheet for EasyTradeSetup ops. Everything you'll actually need at 2 AM.

---

## Daily checks

- `GET /api/health` → 200. Expected shape:
  ```json
  { "ok": true, "checks": { "supabase": { "ok": true, "latencyMs": 40 }, ... } }
  ```
- `/admin` → Open tickets count. If > 0, triage in `/admin/tickets?status=open`.
- `/admin/audit` → Any actions you didn't take? Someone else has the key.

Wire `https://www.easytradesetup.com/api/health` into Uptime Robot / BetterStack with a 60-second interval and SMS alerts.

---

## Incidents

### Site returning 500 on every request

1. `vercel ls` → latest deploy status.
2. `GET /api/health` — which subsystem failed?
3. If `supabase.ok = false`: check Supabase status page, verify service-role key is still valid in Vercel env.
4. If `clerkEnv.ok = false`: Clerk env vars missing. Middleware rewrites `/portal/*` to `/404` in this state but public pages stay up.
5. Rollback: `vercel alias set easytradesetup-<previous-deploy>-nextologics-projects.vercel.app easytradesetup.com`. Same for `www`.

### Customer says "I paid but no access"

1. `/admin/customers` → find by email. License column should be "Active".
2. If "No license" but payment cleared: manual grant via SQL —
   ```sql
   insert into entitlements (user_id, product, source)
   values ('user_CLERK_ID', 'golden-indicator', 'manual')
   on conflict (user_id, product) do update set active = true, revoked_at = null;
   ```
3. Log the reason in the `admins` table note or a ticket for audit trail.

### Customer says "I can't download"

1. Verify their license is active (`/admin/customers`).
2. Check Supabase Storage — is the file at the expected path? E.g. `downloads/golden-indicator/v2.4/golden-indicator.pine`.
3. Try downloading yourself (grant yourself a license + fetch). If 500, check Vercel function logs.

### Email notifications not arriving

1. `GET /api/health` → `resendEnv.ok`. If false, `RESEND_API_KEY` is unset.
2. Resend dashboard → **Domains** → `easytradesetup.com` → is it verified?
3. Resend dashboard → **Logs** → look for bounces / rejections.
4. Note: notification failure is fire-and-forget. Tickets still save — customer only misses the email ping.

---

## Common tasks (SQL)

### Grant admin

```sql
insert into admins (user_id, note)
values ('user_YOUR_CLERK_ID', 'founder · 2026-04-24');
```

Your Clerk user ID is visible at `/portal/account` once signed in.

### Grant lifetime license manually

```sql
insert into entitlements (user_id, product, source)
values ('user_CLERK_ID', 'golden-indicator', 'manual')
on conflict (user_id, product) do update set active = true, revoked_at = null;
```

### Revoke license (refund)

```sql
update entitlements
set active = false, revoked_at = now()
where user_id = 'user_CLERK_ID' and product = 'golden-indicator';
```

### Delete draft update

```sql
delete from updates where slug = 'the-slug' and draft = true;
```

### See recent download attempts for a user

```sql
select path, at from downloads where user_id = 'user_CLERK_ID' order by at desc limit 20;
```

### Who's published what in the last week

```sql
select at, actor_id, action, target_id
from admin_audit_log
where at > now() - interval '7 days'
order by at desc;
```

---

## Deploy workflow

1. Land change on `main` → Vercel auto-deploys.
2. Check `GET /api/health` on the preview URL before promoting.
3. Prod smoke: `/`, `/pricing`, `/portal`, `/admin` (expect 404s on portal/admin until signed in).
4. Apex alias updates on the next git push to `main` automatically. CLI `vercel --prod` creates a deploy but does NOT auto-alias — push an empty commit to promote:
   ```bash
   git commit --allow-empty -m "chore: promote"
   git push
   ```

---

## Rate limits

| Endpoint | Window | Max | Key |
|---|---|---|---|
| `/api/lead` | 1 min | 6 | IP |
| `/api/portal/tickets` (create) | 15 min | 5 | userId |
| `/api/portal/tickets/[id]/messages` | 10 min | 20 | userId |
| `/api/admin/updates` | 10 min | 30 | userId |

In-memory per-instance. At scale, swap `lib/rate-limit.ts` for Upstash Ratelimit.

---

## Env vars (Vercel)

### Required for full function

```
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL            = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL            = /sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL = /portal
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL = /portal

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY                # Production only

NEXT_PUBLIC_SITE_URL                     = https://easytradesetup.com
```

### Optional

```
RESEND_API_KEY                           # ticket + purchase notifications
EMAIL_FROM                               = EasyTradeSetup <welcome@easytradesetup.com>
ADMIN_NOTIFY_EMAIL                       = welcome@easytradesetup.com
```

### Payments (not live yet)

```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
```

---

## Pre-launch checklist

See `LAUNCH.md` for the gated release sequence. Summary:

- [ ] SQL migrations 001, 002, 003 run in Supabase
- [ ] Admin row inserted for founder
- [ ] Supabase storage bucket `downloads` created + files uploaded
- [ ] Real founder identity in `/about` (not "TS")
- [ ] `pk_live_` / `sk_live_` in Vercel
- [ ] Service-role key rotated
- [ ] Resend sender domain verified + DNS records added
- [ ] Cloudflare Email Routing for `hello@` forwarding
- [ ] Stripe products + checkout + webhook
- [ ] Razorpay products + webhook
- [ ] `/api/health` responding 200 from external monitor
- [ ] Google Search Console verified, sitemap submitted
- [ ] Lighthouse passes on `/`, `/pricing`, `/checkout`

---

## What still isn't wired

- **Payments** (Stripe / Razorpay). `/checkout` captures email only.
- **Inbound email** at `hello@…`. Use Cloudflare Email Routing to forward to personal inbox.
- **PDF watermarking** per user.
- **Welcome / receipt transactional emails** (tied to payment webhook).
- **Stripe + Razorpay webhook → `grantEntitlement`** handlers.

When you wire a piece, update this runbook.
