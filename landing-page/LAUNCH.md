# Launch checklist

Gated sequence. Each block blocks the next — don't skip ahead.

## Gate 1 — infra stable

- [ ] Run `landing-page/supabase/migrations/001_portal_schema.sql` in Supabase SQL editor
- [ ] Run `landing-page/supabase/migrations/002_tickets.sql`
- [ ] Run `landing-page/supabase/migrations/003_audit_log.sql`
- [ ] Verify tables exist: `entitlements`, `downloads`, `updates`, `admins`, `tickets`, `ticket_messages`, `admin_audit_log`
- [ ] Insert admin row for founder Clerk user ID
- [ ] `GET https://www.easytradesetup.com/api/health` → `ok: true`, all three checks pass

## Gate 2 — identity + trust

- [ ] Real founder name, photo, LinkedIn on `/about` — no more "TS" placeholder
- [ ] Chart screenshots verified: `public/chart-before.png`, `public/chart-after.png` are real Golden Indicator outputs
- [ ] Privacy + terms + refund pages reviewed by a human
- [ ] SEBI disclaimer present on `/checkout` (India)

## Gate 3 — products live

- [ ] Supabase Storage: private bucket `downloads` created
- [ ] `golden-indicator/v2.4/golden-indicator.pine` uploaded
- [ ] `golden-indicator/trade-logic.pdf` uploaded
- [ ] `golden-indicator/risk-calculator.xlsx` uploaded
- [ ] Test download end-to-end with a manually-granted license

## Gate 4 — security hardened

- [ ] Rotate the Supabase service-role key (the one pasted in chat is compromised)
- [ ] Swap Clerk `pk_test_` / `sk_test_` → `pk_live_` / `sk_live_` on Vercel
- [ ] Verify Clerk dashboard: phone disabled, Google + email magic-link enabled
- [ ] `vercel env ls production` — audit every key, nothing stale

## Gate 5 — email deliverability

- [ ] Resend → Domains → `easytradesetup.com` verified (SPF + DKIM green)
- [ ] Send a test ticket from a dummy account → notification arrives at `ADMIN_NOTIFY_EMAIL`
- [ ] Admin reply → customer receives email

## Gate 6 — inbound contact

- [ ] Cloudflare Email Routing enabled for `easytradesetup.com`
- [ ] `welcome@easytradesetup.com` forwards to personal inbox
- [ ] Test by emailing `hello@` from a separate account

## Gate 7 — payments (THE BIG ONE)

- [ ] Stripe account activated, bank connected, KYC complete
- [ ] Stripe product "Golden Indicator" created, price `$49.00`
- [ ] `/api/webhooks/stripe` endpoint built, wired to `grantEntitlement()`
- [ ] Stripe webhook secret in Vercel env
- [ ] `/checkout` redirects to Stripe Checkout session (not just email capture)
- [ ] Razorpay account KYC complete
- [ ] Razorpay product `₹4,599` created
- [ ] `/api/webhooks/razorpay` endpoint built
- [ ] Razorpay webhook secret in Vercel env
- [ ] End-to-end test: test-mode purchase → entitlement row created → portal unlocks

## Gate 8 — monitoring + SEO

- [ ] Uptime monitor pointed at `/api/health` with 60-second interval + SMS alerts
- [ ] Vercel Analytics confirmed receiving events
- [ ] Google Search Console verified, `sitemap.xml` submitted
- [ ] Lighthouse ≥ 90 Performance on `/`, `/pricing`, `/checkout`
- [ ] Error monitoring (Sentry or similar) wired — optional but recommended

## Gate 9 — soft launch

- [ ] Test purchase with a real card (yourself) end-to-end
- [ ] Refund that test — verify `revokeEntitlement` fires
- [ ] Publish one real market note via `/admin/updates`
- [ ] Open one real ticket from a test account, reply as admin, verify email

## Gate 10 — public launch

- [ ] Remove any "Development mode" banners from auth UI
- [ ] Announce (email list, Twitter, wherever)
- [ ] Watch `/admin` overview tiles hourly for first 24 hours
- [ ] Keep rollback command ready:
  ```bash
  vercel alias set <previous-deploy>.vercel.app easytradesetup.com
  vercel alias set <previous-deploy>.vercel.app www.easytradesetup.com
  ```

---

**Principle:** each gate is a promise to the next one. If Gate 3 fails, Gate 4 still works in isolation but launch is blocked. Don't treat launch as "ship all at once" — treat it as "each layer verified before stacking the next."
