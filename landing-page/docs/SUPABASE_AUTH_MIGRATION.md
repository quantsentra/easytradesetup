# Clerk → Supabase Auth migration

Clerk is out. All auth now runs through Supabase Auth using cookies scoped to `.easytradesetup.com` so sessions share across the marketing host and `portal.easytradesetup.com`.

## What shipped

- **Sign-in / sign-up**: custom pages at `/sign-in` and `/sign-up` (previously Clerk-hosted). Google OAuth + magic-link email. No password.
- **Sign-out**: POST (or GET) to `/auth/sign-out`.
- **OAuth + magic-link callback**: `/auth/callback` exchanges the Supabase code for a session cookie.
- **Account dropdown**: `<AccountMenu>` replaces Clerk's `<UserButton>`. Avatar circle + email + Account / Support / Sign out.
- **Server auth helpers**: `lib/auth-server.ts` — `getUser`, `getUserId`, `getUserById`, `listAllUsers`, `emailsByUserIds`.
- **Middleware**: refreshes Supabase session cookies on every request, redirects unauth users to `/sign-in?redirect=…` on `/portal/*` and `/admin/*`.

## What you need to do on Supabase

### 1. Enable auth providers

Supabase dashboard → **Authentication** → **Providers**:

- **Email**: enabled by default. Confirm **"Enable email confirmations"** — for magic links, you don't need confirmations, but email provider must be ON.
- **Google**:
  1. Toggle on
  2. Get OAuth credentials from Google Cloud Console (free):
     - https://console.cloud.google.com/apis/credentials → **Create credentials** → **OAuth client ID** → Web application
     - **Authorized redirect URI**: `https://<your-supabase-project>.supabase.co/auth/v1/callback` (Supabase shows this exact URL on the Google provider settings page)
     - Copy **Client ID** + **Client Secret** into Supabase Google provider
  3. Save

### 2. Set Site URL + redirect URLs

Supabase dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `https://portal.easytradesetup.com`
- **Redirect URLs** (allowlist):
  - `https://portal.easytradesetup.com/auth/callback`
  - `https://www.easytradesetup.com/auth/callback`
  - `https://easytradesetup.com/auth/callback`
  - `http://localhost:3000/auth/callback` (optional — for local dev)

### 3. Cookie domain (for cross-subdomain sessions)

Supabase dashboard → **Authentication** → **Settings** (or Cookies section depending on dashboard version):

- **Cookie domain**: `.easytradesetup.com` (leading dot shares session between apex + www + portal subdomain)
- If the field isn't visible: Supabase's default domain-scoped cookies work for the host that set them. To share across subdomains you may need to set the cookie domain via advanced config. Current `@supabase/ssr` version defaults to `.<your-domain>` when the domain has at least 2 parts, so in practice this is automatic. Verify by signing in and checking cookies in DevTools — Supabase cookies (`sb-...`) should have Domain = `.easytradesetup.com`.

### 4. Email templates

Supabase dashboard → **Authentication** → **Email Templates** → **Magic Link**:

- Subject: `Sign in to EasyTradeSetup`
- Body: customize the default template if you want (leave as-is to ship fast)
- **Link expiry**: 3600 seconds = 1 hour (current default, good)

Supabase sends these via its own SMTP on free tier. For production deliverability, wire your own SMTP (Resend, Sendgrid, etc.) in Supabase dashboard → **SMTP Settings**.

## Env vars — before vs after

### Remove (from Vercel)

```
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
```

### Keep (unchanged)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
```

## Your existing admin + entitlement row

Your `admins` table currently has a row for your **Clerk** user ID:

```
user_3CnuBQrzMA5AYId6Ead6RLCAD5D
```

That won't work anymore — Supabase Auth issues UUIDs. After the first sign-in via Supabase:

1. Visit `/portal/account` on the portal subdomain (or main domain, same page)
2. Copy your new User ID (UUID like `af4e6bd0-9b68-4f5e-b4e1-...`)
3. Run in Supabase SQL editor:

```sql
-- Remove the old Clerk-based admin row
delete from admins where user_id = 'user_3CnuBQrzMA5AYId6Ead6RLCAD5D';

-- Insert the new Supabase-based admin row
insert into admins (user_id, note)
values ('<YOUR_NEW_SUPABASE_UUID>', 'founder')
on conflict (user_id) do nothing;

-- Same for the test entitlement
delete from entitlements where user_id = 'user_3CnuBQrzMA5AYId6Ead6RLCAD5D';
insert into entitlements (user_id, product, source)
values ('<YOUR_NEW_SUPABASE_UUID>', 'golden-indicator', 'manual')
on conflict (user_id, product) do update set active = true, revoked_at = null;
```

All other tables (`tickets`, `downloads`, `user_activity`, `admin_audit_log`) have text columns for user IDs that accept the UUID format natively — no schema change needed.

## Rollback

If Supabase Auth breaks in a way you can't quickly fix:

```bash
git revert <commit-sha>   # the migration commit
```

Restore the Clerk env vars on Vercel. Clerk session cookies still valid if their TTL hasn't elapsed — users stay signed in.
