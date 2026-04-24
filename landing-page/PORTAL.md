# Portal — auth, entitlements, gated content

Phase-1 portal for EasyTradeSetup. Replaces the email-delivery model with a
signed-in dashboard that houses downloads, strategy docs, and daily market
notes.

## Stack

| Layer       | Pick                                       |
|-------------|---------------------------------------------|
| Auth        | Clerk (Google, email magic-link, passkeys) |
| DB          | Supabase Postgres                          |
| Storage     | Supabase Storage (bucket: `downloads`)     |
| Framework   | Next.js 15 App Router                      |
| Runtime     | Node (webhooks + admin), Edge (middleware) |

Clerk owns user identity. Supabase stores entitlements + downloads audit +
market notes. Payment webhooks (Stripe + Razorpay, wired later) flip the
`active` flag on the matching `entitlements` row.

## Routes

| Path                         | Who                  | What                           |
|------------------------------|----------------------|--------------------------------|
| `/sign-in`, `/sign-up`       | Public               | Clerk-hosted auth              |
| `/portal`                    | Signed-in            | Dashboard                      |
| `/portal/downloads`          | Signed-in + license  | Signed-URL downloads           |
| `/portal/docs`               | Signed-in            | Strategy library (MDX index)   |
| `/portal/docs/[slug]`        | Signed-in            | Individual strategy page       |
| `/portal/updates`            | Signed-in + license  | Daily market notes             |
| `/portal/account`            | Signed-in            | License + email + Clerk ID     |
| `/admin/*`                   | Admin only           | Publish market notes, grants   |
| `/api/portal/download`       | Signed-in + license  | Issues 10-min signed URL       |
| `/api/webhooks/stripe`       | Stripe               | (TBD) grants entitlement       |
| `/api/webhooks/razorpay`     | Razorpay             | (TBD) grants entitlement       |
| `/api/webhooks/clerk`        | Clerk                | (TBD) syncs user → Supabase    |

Marketing site (`/`, `/product`, `/pricing`, etc.) stays fully public.

## Supabase schema

See `supabase/migrations/001_portal_schema.sql`. Run once per environment:

```bash
# Option A — via Supabase CLI
supabase link --project-ref jaxidcfxywdbgoxdgejv
supabase db push

# Option B — paste contents into Supabase dashboard → SQL editor.
```

Tables:

- `entitlements (user_id, product, active, granted_at, revoked_at, source)`
- `downloads (id, user_id, path, at)` — per-request audit trail
- `updates (id, slug, title, excerpt, body_mdx, published_at, draft, created_by, created_at)`
- `admins (user_id, granted_at, note)` — Clerk-id allow list for `/admin`

RLS is on for every table. The app uses the service-role key for all writes,
so RLS acts as defense-in-depth against a leaked anon key.

## Storage

Create a private bucket called **`downloads`**. Inside it, lay out files at:

```
downloads/
  golden-indicator/
    v2.4/
      golden-indicator.pine
    trade-logic.pdf
    risk-calculator.xlsx
```

The `/api/portal/download` route:

1. Verifies the user is signed in.
2. Verifies `getEntitlement(userId).active === true`.
3. Verifies the requested path starts with `golden-indicator/` (no traversal).
4. Asks Supabase for a **signed URL with a 10-minute TTL**.
5. Logs the attempt to `downloads`.
6. Redirects (303) to the signed URL.

## Environment variables

See `.env.example` for the complete list. Minimum set to boot:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY   # server-only, never leaks to client bundle
```

Production values live in Vercel project env. `.env.local` is gitignored.

## Phase-2 checklist (not shipped yet)

- [ ] Stripe webhook → `grantEntitlement` on `checkout.session.completed`
- [ ] Razorpay webhook → same, via `payment.captured`
- [ ] Clerk webhook → pre-create `users` shadow row on `user.created`
- [ ] `/admin/updates` publish UI (MDX editor + `draft` toggle)
- [ ] Fumadocs swap-in for `/portal/docs` (phase-1 is hand-built)
- [ ] Watermark PDF per-user (pdfkit stream, `user_id` + email in footer)
- [ ] Refund webhook → `revokeEntitlement`
- [ ] Transactional email (Resend) — welcome, purchase receipt, refund ack

## Security posture

- Clerk session cookies: `Strict` SameSite, `Secure`, httpOnly (Clerk default).
- Supabase service-role key: server-only, gated behind `"server-only"` import.
- CSP updated in `next.config.mjs` — Clerk + Supabase domains explicitly allowed.
- Download paths validated against an allow-list prefix (no traversal).
- Per-file signed URLs expire in 10 minutes.
- Admin role check is server-side only; middleware just enforces "signed in".

## Local dev

```bash
cd landing-page
npm install
# populate .env.local with keys
npm run dev
```

Hit `http://localhost:3000` for the marketing site. `/portal` redirects to
`/sign-in` until you are authenticated.

## Deployment

Push to `main` → Vercel auto-deploys. Env vars must be set in Vercel:
Settings → Environment Variables → add all values from `.env.example`. Make
sure `SUPABASE_SERVICE_ROLE_KEY` is scoped to Production/Preview only (never
commit).
