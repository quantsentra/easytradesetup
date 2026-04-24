# Migrating portal + admin to `portal.easytradesetup.com`

Target: `portal.easytradesetup.com/downloads`, `portal.easytradesetup.com/admin/tickets`, etc.

The code side ships a middleware that:
- Rewrites `portal.easytradesetup.com/foo` → internal `/portal/foo` (clean URL in the address bar, /portal/ in the app tree).
- Redirects `portal.easytradesetup.com/portal/foo` → `portal.easytradesetup.com/foo` (strips duplicate prefix if anyone pastes an old link).
- Redirects `www.easytradesetup.com/portal/foo` → `portal.easytradesetup.com/foo` (so bookmarked marketing-host portal URLs self-heal).
- Redirects `www.easytradesetup.com/admin/foo` → `portal.easytradesetup.com/admin/foo`.

Nothing else has to change in app code — internal `<Link href="/portal/...">` and `<Link href="/admin/...">` still work. On the portal host, the redirect rule sanitises them to clean URLs in the browser's address bar.

## Steps (in order)

### 1. DNS at your registrar

Add a CNAME:

```
Host:   portal
Type:   CNAME
Value:  cname.vercel-dns.com
TTL:    3600 (or registrar default)
```

Propagation: usually 1–30 minutes.

### 2. Vercel — add the domain to the existing project

- Vercel → Project → **Domains** → **Add** → `portal.easytradesetup.com`
- Vercel will auto-detect the CNAME and issue an SSL cert
- Do NOT redirect it to `www.easytradesetup.com` — leave it as a primary alias pointed at the same deployment

### 3. Vercel env — update Clerk fallback redirect

Same project → Settings → Environment Variables. Edit both Preview + Production:

```
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL  = https://portal.easytradesetup.com/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL  = https://portal.easytradesetup.com/
```

Switching to absolute URLs so a sign-in flow that starts on the marketing host lands on the portal host after auth.

### 4. Clerk dashboard — add subdomain as allowed origin

- Clerk dashboard → your app → **Domains & URLs** (or **Paths**, depending on Clerk version)
- Add `https://portal.easytradesetup.com` as an allowed origin
- If you see a **Cookie domain** field, set it to `.easytradesetup.com` (note the leading dot — that's what shares the session across apex + subdomain)
- If you're still on the Clerk dev instance, do this in both **development** and **production** instances before you launch

### 5. Redeploy

Push any commit, or `vercel --prod`, so the new middleware is live.

### 6. Verify

```bash
# marketing → portal redirect
curl -sI https://www.easytradesetup.com/portal | grep -iE "^HTTP|location"
# expect 301 → https://portal.easytradesetup.com/

# clean URL on portal host
curl -sI https://portal.easytradesetup.com/ | grep -i "^HTTP"
# expect 200 or 307 (Clerk redirect to /sign-in)

# duplicate /portal/ prefix self-heals
curl -sI https://portal.easytradesetup.com/portal/downloads | grep -iE "^HTTP|location"
# expect 301 → https://portal.easytradesetup.com/downloads

# admin stays on /admin path
curl -sI https://portal.easytradesetup.com/admin | grep -i "^HTTP"
# expect 404 (unauth) or 200 (signed-in admin)
```

Then end-to-end sign-in flow:
1. Sign out everywhere
2. Go to `https://www.easytradesetup.com/`
3. Click "Sign in" in the nav
4. Clerk hosted page loads (URL may be on portal or marketing host depending on Clerk config)
5. Finish auth with Google or magic-link
6. Should land on `https://portal.easytradesetup.com/` — the dashboard

### 7. Update anywhere external that links to old portal URLs

- README.md
- RUNBOOK.md
- LAUNCH.md
- any email templates
- any social post drafts

The redirect rule will keep old links working, but fresh links should use the subdomain directly.

## What didn't change

- All app routes still live under `app/portal/*` and `app/admin/*` in the codebase.
- Internal `<Link href="/portal/...">` still works — middleware handles the cosmetic URL cleanup.
- `/api/portal/*` endpoints unchanged — accessible from both hosts.
- Clerk middleware auth-protection logic unchanged.
- SEO impact: none (portal was noindex anyway).

## Rollback

If something breaks:

1. Remove `portal.easytradesetup.com` from Vercel domains.
2. Revert `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` back to `/portal`.
3. Revert the middleware commit: `git revert <commit-sha>`.

All portal + admin routes on the main domain continue working as before.
