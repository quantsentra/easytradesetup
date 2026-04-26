# EasyTradeSetup — System Architecture

State of 2026-04-26. Covers hosting, routing, frontend, backend, database, auth, integrations, CI/CD.

> **Render the diagrams**
>
> - **GitHub** — view this file directly; mermaid blocks render as SVG.
> - **VSCode** — install `Markdown Preview Mermaid Support` extension.
> - **Export PNG/SVG** — paste any mermaid block into <https://mermaid.live> → Actions → Download.
> - **Visio** — draw.io / Lucidchart import mermaid as native diagrams.

---

## 1. System overview

```mermaid
graph TB
    user(["User browser"])

    subgraph DNS["DNS · Vercel domains"]
        apex["easytradesetup.com (apex)<br/>307 → www"]
        www["www.easytradesetup.com"]
        portal["portal.easytradesetup.com"]
    end

    user -->|HTTPS| apex
    user -->|HTTPS| www
    user -->|HTTPS| portal

    subgraph Vercel["Vercel · Next.js 15.5 App Router"]
        mw["middleware.ts<br/>(host-aware routing + auth gate)"]

        subgraph routes["Route groups"]
            mkt["/(marketing)/*<br/>14 public pages + 6 SEO"]
            auth_g["/(auth)/sign-in<br/>/(auth)/sign-up"]
            portal_r["/portal/*<br/>9 routes"]
            admin_r["/admin/*<br/>5 routes"]
            api_r["/api/*<br/>10 endpoints"]
        end

        mw --> mkt
        mw --> auth_g
        mw --> portal_r
        mw --> admin_r
        mw --> api_r
    end

    apex --> mw
    www --> mw
    portal --> mw

    subgraph Supabase["Supabase · Postgres + Auth"]
        sb_auth["auth.users<br/>(email/password + Google OAuth)"]
        sb_db[("Postgres<br/>10 tables")]
    end

    api_r -->|service-role key| sb_db
    portal_r -->|server-side session| sb_auth
    admin_r -->|isAdmin gate| sb_db
    auth_g --> sb_auth

    subgraph External["External services"]
        google["Google OAuth"]
        gsc["Google Search Console"]
        bing["Bing Webmaster"]
        yahoo["Yahoo Finance API"]
        stooq["Stooq CSV"]
        vercel_an["Vercel Analytics"]
        gumroad["Gumroad<br/>(planned · global $)"]
        razorpay["Razorpay UPI<br/>(planned · India ₹)"]
        resend["Resend email<br/>(planned)"]
    end

    auth_g -.->|OAuth| google
    api_r -->|/api/quotes| yahoo
    api_r -->|/api/quotes fallback| stooq
    mkt -.-> vercel_an
    google -.-> sb_auth
    gsc -.->|verify meta tag| mkt
    bing -.->|verify meta tag| mkt
    api_r -.->|TODO webhook| razorpay
    api_r -.->|TODO webhook| gumroad
    api_r -.->|TODO send| resend

    subgraph CI["CI / CD"]
        gh["GitHub<br/>quantsentra/easytradesetup"]
        gha["GitHub Actions<br/>vitest + Playwright"]
        deploy["Vercel auto-deploy<br/>main → production"]
    end

    gh --> gha
    gh --> deploy
    deploy --> Vercel

    classDef external fill:#fef9e7,stroke:#b47216
    classDef planned stroke-dasharray: 5 5
    class External,vercel_an,gsc,bing,yahoo,stooq,google external
    class gumroad,razorpay,resend planned
```

---

## 2. Host-aware routing (middleware.ts)

```mermaid
flowchart TD
    req{"Request<br/>host?"}

    req -->|easytradesetup.com| apex_redir["301 → www.easytradesetup.com"]

    req -->|www.easytradesetup.com| www_path{"path?"}
    www_path -->|/admin/*| www_admin["301 → portal/admin/*"]
    www_path -->|/sign-in /sign-up<br/>/auth/*| www_auth["301 → portal/sign-in etc."]
    www_path -->|/portal/*| www_portal["301 → portal/* (cleaned)"]
    www_path -->|else| render_mkt["render /(marketing)/*"]

    req -->|portal.easytradesetup.com| portal_path{"path?"}
    portal_path -->|/portal/*| portal_strip["301 → / (drop /portal prefix)"]
    portal_path -->|/admin /sign-* /auth<br/>/api /_next /favicon| pass["passthrough — render literal path"]
    portal_path -->|else| rewrite["rewrite to /portal/*"]

    pass --> auth_check{"needsAuth(path)?"}
    rewrite --> auth_check
    auth_check -->|no| render["render"]
    auth_check -->|yes, no session| signin_redir["302 → /sign-in?redirect=..."]
    auth_check -->|yes, has session| admin_check{"path = /admin/*?"}
    admin_check -->|no| render
    admin_check -->|yes, in admins| render
    admin_check -->|yes, NOT in admins| four04["notFound()"]
```

---

## 3. Frontend route map

```mermaid
graph LR
    subgraph mkt["/(marketing) — www subdomain"]
        home["/<br/>Hero · CleanVsNoisy · Bundle ·<br/>MultiMarket · FAQTeaser ·<br/>PricingTeaser · FinalCTA"]
        product["/product"]
        pricing["/pricing"]
        checkout["/checkout<br/>email → /api/lead"]
        compare["/compare"]
        sample["/sample"]
        resources["/resources"]
        ind["/indicator/[market]<br/>nifty · banknifty · spx ·<br/>nasdaq · gold · btc"]
        docs_install["/docs/install<br/>+ HowToJsonLd"]
        docs_faq["/docs/faq"]
        legal["/legal/{disclaimer,privacy,terms,refund}"]
        misc["/about · /contact · /thank-you"]
    end

    subgraph auth["(auth) — portal subdomain"]
        sigin["/sign-in"]
        sigup["/sign-up"]
        cb["/auth/callback"]
    end

    subgraph portal_g["/portal — portal subdomain"]
        p_home["/portal<br/>KPI bento · activity feed"]
        p_docs["/portal/docs<br/>strategy library"]
        p_dl["/portal/downloads"]
        p_up["/portal/updates"]
        p_supp["/portal/support"]
        p_acc["/portal/account"]
    end

    subgraph admin_g["/admin — portal subdomain (gated)"]
        a_home["/admin<br/>Tabler overview · KPIs ·<br/>India/Global split · top pages"]
        a_cust["/admin/customers"]
        a_tk["/admin/tickets"]
        a_up["/admin/updates"]
        a_au["/admin/audit"]
    end

    home --> checkout
    home --> sample
    home --> compare
    pricing --> checkout
    sample --> checkout
    compare --> checkout
    ind --> checkout
    sigin --> p_home
    p_home --> a_home
```

---

## 4. Data model

```mermaid
erDiagram
    auth_users ||--o{ admins : "user_id"
    auth_users ||--o{ entitlements : "user_id"
    auth_users ||--o{ downloads : "user_id"
    auth_users ||--o{ tickets : "user_id"
    auth_users ||--o{ user_activity : "user_id"
    auth_users ||--o{ updates : "created_by"
    tickets ||--o{ ticket_messages : "ticket_id"

    auth_users {
        uuid id PK
        text email
        text encrypted_password
        timestamptz email_confirmed_at
        timestamptz created_at
    }

    admins {
        text user_id PK
        timestamptz granted_at
        text note
    }

    entitlements {
        text user_id PK
        text product PK
        boolean active
        timestamptz granted_at
        timestamptz revoked_at
        text source "stripe|razorpay|manual|refund"
    }

    downloads {
        bigserial id PK
        text user_id
        text path
        timestamptz at
    }

    updates {
        uuid id PK
        text slug
        text title
        text body_mdx
        boolean draft
        timestamptz published_at
        text created_by
    }

    tickets {
        uuid id PK
        text user_id
        text subject
        text status "open|waiting|closed"
        timestamptz created_at
    }

    ticket_messages {
        uuid id PK
        uuid ticket_id FK
        text author_id
        boolean from_admin
        text body
        timestamptz created_at
    }

    user_activity {
        text user_id PK
        timestamptz last_seen_at
        integer visit_count
        timestamptz first_seen_at
    }

    audit_log {
        bigserial id PK
        text actor_user_id
        text action
        jsonb meta
        timestamptz at
    }

    pageviews {
        bigserial id PK
        text visitor_id
        text path
        text referer
        text country
        timestamptz at
    }
```

---

## 5. Authentication flow

```mermaid
sequenceDiagram
    actor U as User
    participant W as www / portal page
    participant SI as /sign-in (portal host)
    participant SB as Supabase Auth
    participant G as Google OAuth
    participant CB as /auth/callback (portal host)
    participant P as /portal or /admin

    U->>W: click Sign in
    W->>SI: 301 (if on www)

    alt Google OAuth
        U->>SI: click Continue with Google
        SI->>G: signInWithOAuth
        G-->>U: Google consent
        U->>G: approve
        G->>CB: redirect with code
        CB->>SB: exchangeCodeForSession
        SB-->>CB: cookie set on portal.easytradesetup.com
        CB->>P: 302 → /portal
    else Magic link
        U->>SI: enter email
        SI->>SB: signInWithOtp
        SB-->>U: email with link
        U->>CB: click link
        CB->>SB: exchangeCodeForSession
        SB-->>CB: cookie set
        CB->>P: 302 → /portal
    else Password
        U->>SI: email + password
        SI->>SB: signInWithPassword
        SB-->>SI: cookie set
        SI->>P: window.location = redirect
    end

    P->>P: middleware checks session<br/>+ admins row (if /admin/*)
```

---

## 6. Pageview tracking pipeline

```mermaid
flowchart LR
    visit["Marketing page view"] --> tracker["<PageviewTracker /><br/>(client component)"]
    tracker -->|POST /api/track/pageview| api["route handler"]

    api --> bot{"User-Agent<br/>matches bot regex?"}
    bot -->|yes| skip1["skip"]
    bot -->|no| skip_path{"path in skip-list?<br/>/api /portal /admin<br/>/sign-* /auth"}

    skip_path -->|yes| skip2["skip"]
    skip_path -->|no| hash["sha256(salt + IP + UA + day)<br/>→ visitor_id (32 chars)"]

    hash --> insert[("INSERT INTO pageviews<br/>(visitor_id, path, country, at)")]

    insert --> admin["Admin overview reads<br/>last 30d for KPIs +<br/>top-5 paths last 7d"]

    classDef pii fill:#fee,stroke:#c00
    note["No raw IP stored.<br/>visitor_id rotates daily —<br/>cannot cross-day re-identify."]:::pii
    hash -.-> note
```

---

## 7. CI / CD pipeline

```mermaid
flowchart LR
    dev["Local edits"] --> push["git push origin main"]

    push --> gh{"GitHub<br/>quantsentra/easytradesetup"}

    gh --> gha["GitHub Actions<br/>.github/workflows/test.yml"]
    gh --> vercel["Vercel webhook"]

    gha --> unit["unit job<br/>Node 24 · vitest run · next build"]
    unit --> e2e["e2e job<br/>Playwright chromium (cached)"]
    e2e --> badge["status badge"]

    vercel --> build["Vercel build<br/>next build"]
    build --> domains{"Deploy to domains"}
    domains --> dom_www["www.easytradesetup.com"]
    domains --> dom_portal["portal.easytradesetup.com"]
    domains --> dom_apex["easytradesetup.com (307)"]

    classDef green fill:#e7f9ed,stroke:#1f9d55
    class unit,e2e,build green
```

---

## 8. Component inventory

| Layer | Module | Purpose |
|---|---|---|
| Marketing chrome | `components/nav/TopNav.tsx` | Top nav + `BrandMark` (cyan-blue gradient logo) |
| | `components/nav/Footer.tsx` | Site footer |
| | `components/nav/SiteDisclaimer.tsx` | Educational + SEBI strip |
| | `components/ui/OfferBanner.tsx` | Dismissible top banner |
| | `components/ui/StickyBuyBar.tsx` | Mobile sticky buy CTA |
| | `components/ui/ExitIntent.tsx` | Exit-intent modal |
| | `components/ui/BackToTop.tsx` | Floating arrow |
| Hero | `components/sections/Hero.tsx` | Main hero with rotating word |
| | `components/ui/HeroSlider.tsx` | 3-screen NIFTY/Gold/US30 ticker |
| Sections | `Bundle`, `MultiMarket`, `CleanVsNoisy`, `FAQTeaser`, `PricingTeaser`, `FinalCTA` | Home composition |
| Auth | `components/auth/SignInForm.tsx` | Google OAuth + magic link + password |
| | `components/auth/AccountMenu.tsx` | Avatar dropdown |
| Portal | `app/portal/layout.tsx` | tz-header + tz-sidenav + tz-footer |
| | `components/nav/PortalMobileNav.tsx` | Hamburger drawer |
| Admin | `app/admin/layout.tsx` | Same shell as portal, isAdmin gate |
| Analytics | `components/analytics/PageviewTracker.tsx` | Fires on every pathname change |
| SEO | `components/seo/JsonLd.tsx` | Organization, WebSite, Product, SoftwareApplication, SiteNavigation, HowTo, FAQ, Breadcrumb |
| Server libs | `lib/admin.ts`, `lib/auth-server.ts`, `lib/supabase/{browser,server}.ts` | Supabase clients + role helpers |
| Constants | `lib/pricing.ts`, `lib/launch.ts` | Single source of truth for prices + offer dates |

---

## 9. Health snapshot

| Area | Status | Note |
|---|---|---|
| Marketing site | ✅ | 7-section home, 6 SEO pages, JsonLd, sitemap, robots, GSC + Bing verified |
| Portal | ✅ | Brand-aligned, sidebar, KPIs, market-notes feed |
| Admin | ✅ | Tabler-style overview, India/Global split, traffic KPIs |
| Auth | ✅ | OAuth + magic link + password (single-host, no double sign-in) |
| Database | ⚠️ | `pageviews` migration pending — run SQL in Supabase |
| Tests | ✅ | 34 unit + 38 e2e green; CI workflow committed |
| Payments | ❌ | Not live. UPI (India) + Gumroad (global) planned |
| Analytics | ⚠️ | Self-hosted pageviews coded; needs migration. Vercel Analytics also wired |
| Email delivery | ❌ | `/api/lead` logs to console; not wired to Resend/Sheet |
| Cron jobs | ❌ | Removed (Hobby plan limits) |

---

## 10. Improvement backlog

### P0 — unblocks revenue
1. Run `005_pageviews.sql` migration in Supabase
2. Wire payments — Razorpay UPI (India) + Gumroad webhook (global)
3. `/api/lead` → Resend send + Supabase `leads` table

### P1 — marketing motion
4. Activate GitHub Actions CI (open PR to trigger first run)
5. Quote API resilience — Twelve Data fallback or Cloudflare Worker proxy
6. Real founder bio + photo + LinkedIn on `/about`
7. First customer testimonials on `/principles` (post-launch only)
8. OG image verification on Twitter/LinkedIn/WhatsApp

### P2 — SEO compounding
9. `/setup/[name] × /market/[m]` programmatic grid (24 pages)
10. `/notes/[slug]` public-facing market notes (gated full body in `/portal/updates`)
11. Internal link graph between `/indicator/*` and setup pages
12. `next/image` AVIF + responsive sizes for all chart screenshots

### P3 — admin polish
13. Sparklines for visitors + revenue (SVG, no chart lib)
14. CSV export on `/admin/customers`
15. Cohort retention — entitlements × pageviews
16. Tickets SLA badge (>24h waiting)
17. Country breakdown (pageviews already capture `country`)

### P4 — durability
18. Verify Supabase backup retention
19. Sentry error reporting (free tier)
20. Rate limit `/api/track/pageview` (lib already exists)
21. Pageview retention prune job (>90d)
22. Vercel BotID on `/checkout`

### P5 — scale prep
23. Vercel Hobby → Pro for crons + longer timeouts
24. Multi-admin via `admins` table inserts
25. `Trade Logic PDF` standalone $9 SKU

---

## 11. Repository layout

```
easytradesetup/
├─ landing-page/
│  ├─ app/                    Next.js App Router routes
│  ├─ components/             UI components (sections, nav, ui, auth, analytics, seo)
│  ├─ lib/                    server helpers + constants
│  ├─ supabase/migrations/    SQL migrations 001-005
│  ├─ public/                 static assets
│  ├─ tests/                  unit (vitest) + e2e (Playwright)
│  ├─ docs/                   ← this file lives here
│  ├─ middleware.ts           host-aware routing + auth gate
│  ├─ tailwind.config.ts      brand tokens (navy + cyan-blue + gold)
│  ├─ next.config.mjs
│  └─ vercel.json
├─ src/pine/                  Golden Indicator Pine v5 source
├─ .github/workflows/test.yml CI workflow
└─ CLAUDE.md                  project context for AI assistant
```
