import Link from "next/link";
import Mermaid from "@/components/admin/Mermaid";

export const metadata = {
  title: "Architecture · Admin",
  robots: { index: false, follow: false },
};

const overviewChart = `graph TB
    user(["User browser"])

    subgraph DNS["DNS · Vercel domains"]
        apex["easytradesetup.com<br/>(307 → www)"]
        www["www.easytradesetup.com"]
        portal["portal.easytradesetup.com"]
    end

    user --> apex
    user --> www
    user --> portal

    subgraph Vercel["Vercel · Next.js App Router"]
        mw["middleware.ts<br/>host-aware routing + auth gate"]
        mkt["/(marketing)/*<br/>14 public + 6 SEO"]
        auth_g["/(auth)/sign-in<br/>/(auth)/sign-up"]
        portal_r["/portal/*<br/>9 routes"]
        admin_r["/admin/*<br/>5 routes"]
        api_r["/api/*<br/>10 endpoints"]
        mw --> mkt
        mw --> auth_g
        mw --> portal_r
        mw --> admin_r
        mw --> api_r
    end

    apex --> mw
    www --> mw
    portal --> mw

    subgraph Supabase["Supabase"]
        sb_auth["auth.users<br/>email+pw, Google OAuth"]
        sb_db[("Postgres · 10 tables")]
    end

    api_r --> sb_db
    portal_r --> sb_auth
    admin_r --> sb_db
    auth_g --> sb_auth

    subgraph Ext["External"]
        google["Google OAuth"]
        gsc["Google Search Console"]
        bing["Bing Webmaster"]
        yahoo["Yahoo Finance"]
        stooq["Stooq CSV"]
        razorpay["Razorpay UPI · planned"]
        gumroad["Gumroad · planned"]
        resend["Resend · planned"]
    end

    auth_g -.-> google
    api_r --> yahoo
    api_r --> stooq
    google -.-> sb_auth
    gsc -.-> mkt
    bing -.-> mkt
    api_r -.-> razorpay
    api_r -.-> gumroad
    api_r -.-> resend`;

const routingChart = `flowchart TD
    req{Request host}

    req -->|easytradesetup.com| apex_redir["301 → www"]

    req -->|www.easytradesetup.com| www_path{path}
    www_path -->|/admin/*| www_admin["301 → portal/admin"]
    www_path -->|/sign-in /sign-up<br/>/auth/*| www_auth["301 → portal"]
    www_path -->|/portal/*| www_portal["301 → portal cleaned"]
    www_path -->|else| render_mkt["render /(marketing)/*"]

    req -->|portal.easytradesetup.com| portal_path{path}
    portal_path -->|/portal/*| portal_strip["301 → drop /portal prefix"]
    portal_path -->|/admin /sign-* /auth<br/>/api /_next /favicon| pass[passthrough]
    portal_path -->|else| rewrite["rewrite to /portal/*"]

    pass --> auth_check{needsAuth?}
    rewrite --> auth_check
    auth_check -->|no| render["render"]
    auth_check -->|yes, no session| signin_redir["302 → /sign-in"]
    auth_check -->|yes, has session| admin_check{path = /admin/*?}
    admin_check -->|no| render
    admin_check -->|yes, in admins| render
    admin_check -->|yes, NOT in admins| four04["notFound"]`;

const routesChart = `graph LR
    subgraph mkt["(marketing) — www"]
        home["/<br/>7 sections"]
        product["/product"]
        pricing["/pricing"]
        checkout["/checkout"]
        compare["/compare"]
        sample["/sample"]
        resources["/resources"]
        ind["/indicator/[market]<br/>6 pages"]
        docs_install["/docs/install"]
        docs_faq["/docs/faq"]
        legal["/legal/*<br/>4 pages"]
    end

    subgraph auth["(auth) — portal"]
        sigin["/sign-in"]
        sigup["/sign-up"]
        cb["/auth/callback"]
    end

    subgraph portal_g["/portal — portal"]
        p_home["/portal<br/>KPI bento"]
        p_docs["/portal/docs"]
        p_dl["/portal/downloads"]
        p_up["/portal/updates"]
        p_supp["/portal/support"]
        p_acc["/portal/account"]
    end

    subgraph admin_g["/admin — gated"]
        a_home["/admin<br/>Tabler overview"]
        a_cust["/admin/customers"]
        a_tk["/admin/tickets"]
        a_arch["/admin/architecture<br/>(this page)"]
        a_au["/admin/audit"]
    end

    home --> checkout
    home --> sample
    pricing --> checkout
    sigin --> p_home
    p_home --> a_home`;

const dataChart = `erDiagram
    auth_users ||--o{ admins : ""
    auth_users ||--o{ entitlements : ""
    auth_users ||--o{ downloads : ""
    auth_users ||--o{ tickets : ""
    auth_users ||--o{ user_activity : ""
    auth_users ||--o{ updates : ""
    tickets ||--o{ ticket_messages : ""

    auth_users {
        uuid id PK
        text email
        text encrypted_password
    }
    admins {
        text user_id PK
        text note
    }
    entitlements {
        text user_id PK
        text product PK
        boolean active
        text source
    }
    downloads {
        bigint id PK
        text user_id
        text path
    }
    updates {
        uuid id PK
        text slug
        boolean draft
        text body_mdx
    }
    tickets {
        uuid id PK
        text user_id
        text status
    }
    ticket_messages {
        uuid id PK
        uuid ticket_id FK
        text body
    }
    user_activity {
        text user_id PK
        timestamptz last_seen_at
        int visit_count
    }
    audit_log {
        bigint id PK
        text actor_user_id
        text action
        jsonb meta
    }
    pageviews {
        bigint id PK
        text visitor_id
        text path
        text country
    }`;

const authChart = `sequenceDiagram
    actor U as User
    participant W as www / portal page
    participant SI as /sign-in
    participant SB as Supabase Auth
    participant G as Google OAuth
    participant CB as /auth/callback
    participant P as /portal or /admin

    U->>W: click Sign in
    W->>SI: 301 if on www

    alt Google OAuth
        U->>SI: click Continue with Google
        SI->>G: signInWithOAuth
        G-->>U: consent screen
        U->>G: approve
        G->>CB: redirect with code
        CB->>SB: exchangeCodeForSession
        SB-->>CB: session cookie
        CB->>P: 302 → /portal
    else Magic link
        U->>SI: email
        SI->>SB: signInWithOtp
        SB-->>U: email link
        U->>CB: click link
        CB->>SB: exchange
        SB-->>CB: cookie
        CB->>P: 302 → /portal
    else Password
        U->>SI: email + password
        SI->>SB: signInWithPassword
        SB-->>SI: cookie
        SI->>P: window.location = redirect
    end

    P->>P: middleware checks session<br/>+ admins row if /admin/*`;

const trackingChart = `flowchart LR
    visit["Marketing page view"] --> tracker["PageviewTracker<br/>client component"]
    tracker -->|POST /api/track/pageview| api["Node route handler"]

    api --> bot{UA matches bot regex?}
    bot -->|yes| skip1[skip]
    bot -->|no| skip_path{path in skip-list?}

    skip_path -->|yes| skip2[skip]
    skip_path -->|no| hash["sha256(salt + ip + ua + day)<br/>→ 32-char visitor_id"]

    hash --> insert[("INSERT INTO pageviews")]
    insert --> admin["Admin reads last 30d<br/>uniques + top-5 paths"]`;

const cicdChart = `flowchart LR
    dev["Local edits"] --> push["git push origin main"]
    push --> gh{GitHub repo}

    gh --> gha["Actions · test.yml"]
    gh --> vercel["Vercel webhook"]

    gha --> unit["unit job<br/>Node 24 · vitest · build"]
    unit --> e2e["e2e job<br/>Playwright chromium"]

    vercel --> build["Vercel build<br/>next build"]
    build --> domains{Deploy to domains}
    domains --> dom_www["www.easytradesetup.com"]
    domains --> dom_portal["portal.easytradesetup.com"]
    domains --> dom_apex["easytradesetup.com (307)"]`;

type StatusKind = "ok" | "warn" | "miss";
const statusColor = (s: StatusKind) =>
  s === "ok" ? "var(--tz-win)" : s === "warn" ? "var(--tz-amber)" : "var(--tz-loss)";

const health: Array<{ area: string; status: StatusKind; note: string }> = [
  { area: "Marketing site", status: "ok",   note: "7-section home, 6 SEO pages, JsonLd, sitemap, robots, GSC + Bing verified" },
  { area: "Portal",         status: "ok",   note: "Brand-aligned, sidebar, KPIs, market-notes feed" },
  { area: "Admin",          status: "ok",   note: "Tabler overview, India/Global split, traffic KPIs" },
  { area: "Auth",           status: "ok",   note: "OAuth + magic link + password, single-host cookie" },
  { area: "Database",       status: "warn", note: "pageviews migration pending — run SQL in Supabase" },
  { area: "Tests",          status: "ok",   note: "34 unit + 38 e2e green; CI workflow committed" },
  { area: "Payments",       status: "miss", note: "Not live. UPI (India) + Gumroad (global) planned" },
  { area: "Analytics",      status: "warn", note: "Self-hosted pageviews coded; Vercel Analytics also wired" },
  { area: "Email delivery", status: "miss", note: "/api/lead logs to console; not wired to Resend/Sheet" },
  { area: "Cron jobs",      status: "miss", note: "Removed — Hobby plan limits" },
];

const backlog: Array<{ tier: string; title: string; items: string[]; color: string }> = [
  {
    tier: "P0", title: "Unblocks revenue", color: "#d93b3b",
    items: [
      "Run 005_pageviews.sql migration in Supabase.",
      "Wire payments — Razorpay UPI (India) + Gumroad webhook (global). Add payments table.",
      "/api/lead → Resend send + Supabase leads table.",
    ],
  },
  {
    tier: "P1", title: "Marketing motion", color: "#2B7BFF",
    items: [
      "Activate GitHub Actions CI (open PR to trigger first run).",
      "Quote API resilience — Twelve Data fallback or Cloudflare Worker proxy.",
      "Real founder bio + photo + LinkedIn on /about.",
      "First customer testimonials on /principles (post-launch only).",
      "OG image verification on Twitter / LinkedIn / WhatsApp.",
    ],
  },
  {
    tier: "P2", title: "SEO compounding", color: "#22D3EE",
    items: [
      "/setup/[name] × /market/[m] programmatic grid (24 long-tail pages).",
      "/notes/[slug] public market notes (gated full body in /portal/updates).",
      "Internal link graph between /indicator/* and setup pages.",
      "next/image AVIF + responsive sizes for all chart screenshots.",
    ],
  },
  {
    tier: "P3", title: "Admin polish", color: "#F0C05A",
    items: [
      "Sparklines for visitors + revenue (SVG, no chart lib).",
      "CSV export on /admin/customers.",
      "Cohort retention — entitlements × pageviews.",
      "Tickets SLA badge (>24h waiting).",
      "Country breakdown (pageviews already capture country).",
    ],
  },
  {
    tier: "P4", title: "Durability", color: "#8B5CF6",
    items: [
      "Verify Supabase backup retention.",
      "Sentry error reporting (free tier).",
      "Rate-limit /api/track/pageview (lib already exists).",
      "Pageview retention prune job (>90d).",
      "Vercel BotID on /checkout.",
    ],
  },
  {
    tier: "P5", title: "Scale prep", color: "#888",
    items: [
      "Vercel Hobby → Pro for crons + longer timeouts.",
      "Multi-admin via admins table inserts.",
      "Trade Logic PDF standalone $9 SKU.",
    ],
  },
];

const components: Array<[string, string, string]> = [
  ["Chrome",       "nav/TopNav.tsx",                    "Top nav + BrandMark export"],
  ["",             "nav/Footer.tsx",                    "Site footer"],
  ["",             "nav/SiteDisclaimer.tsx",            "Educational + SEBI strip"],
  ["",             "ui/OfferBanner.tsx",                "Dismissible top banner"],
  ["",             "ui/StickyBuyBar.tsx",               "Mobile sticky buy CTA"],
  ["",             "ui/ExitIntent.tsx",                 "Exit-intent modal"],
  ["",             "ui/BackToTop.tsx",                  "Floating arrow"],
  ["Hero",         "sections/Hero.tsx",                 "Main hero + rotating word"],
  ["",             "ui/HeroSlider.tsx",                 "3-screen NIFTY/Gold/US30 ticker"],
  ["Sections",     "Bundle / MultiMarket / CleanVsNoisy / FAQTeaser / PricingTeaser / FinalCTA", "Home composition"],
  ["Auth",         "auth/SignInForm.tsx",               "OAuth + magic link + password"],
  ["",             "auth/AccountMenu.tsx",              "Avatar dropdown"],
  ["Portal",       "app/portal/layout.tsx",             "tz-header + sidenav + footer"],
  ["",             "nav/PortalMobileNav.tsx",           "Hamburger drawer"],
  ["Admin",        "app/admin/layout.tsx",              "Same shell, isAdmin gate"],
  ["Analytics",    "analytics/PageviewTracker.tsx",     "Fires on every pathname change"],
  ["SEO",          "seo/JsonLd.tsx",                    "Org · WebSite · Product · SoftwareApplication · SiteNavigation · HowTo · FAQ · Breadcrumb"],
  ["Server libs",  "lib/admin.ts · lib/auth-server.ts · lib/supabase/*", "Supabase clients + role helpers"],
  ["Constants",    "lib/pricing.ts · lib/launch.ts",    "Price + offer date single source"],
];

export default function ArchitecturePage() {
  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Architecture.</h1>
          <div className="tz-topbar-sub">
            Living system map · diagrams + health + backlog. Edit source at{" "}
            <code style={{ fontSize: 12, color: "var(--tz-acid-dim)" }}>
              landing-page/docs/ARCHITECTURE.md
            </code>
          </div>
        </div>
        <div className="tz-topbar-actions">
          <a href="https://www.easytradesetup.com/docs/architecture.html" target="_blank" rel="noopener" className="tz-btn">
            ↗ Standalone HTML
          </a>
          <Link href="/admin" className="tz-btn tz-btn-primary">← Overview</Link>
        </div>
      </div>

      {/* Hero card with quick stats */}
      <div className="tz-card mb-6" style={{
        background: "radial-gradient(circle at 100% 0%, rgba(43,123,255,0.10), transparent 55%), radial-gradient(circle at 0% 100%, rgba(34,211,238,0.08), transparent 55%), var(--tz-surface)",
        padding: 28,
      }}>
        <div className="text-[11px] font-mono uppercase tracking-[0.16em]" style={{ color: "var(--tz-ink-mute)" }}>
          System architecture · v1.0
        </div>
        <h2 style={{
          font: "700 28px var(--tz-display)", letterSpacing: "-0.025em",
          margin: "10px 0 8px", color: "var(--tz-ink)",
        }}>
          One TradingView indicator. One stack. One source of truth.
        </h2>
        <p className="text-[14.5px]" style={{ color: "var(--tz-ink-dim)", maxWidth: 720 }}>
          Hosting, routing, frontend route groups, Supabase data model, auth flow, pageview tracking,
          CI/CD pipeline, and a 25-item prioritised improvement backlog. Hand this URL to any future
          developer to get up to speed.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="tz-chip tz-chip-acid">Next.js 15.5</span>
          <span className="tz-chip tz-chip-cyan">Supabase</span>
          <span className="tz-chip tz-chip-gold">Vercel · Hobby</span>
          <span className="tz-chip">React 19</span>
          <span className="tz-chip">Tailwind 3.4</span>
          <span className="tz-chip">TypeScript 5.7</span>
        </div>
      </div>

      {/* TOC */}
      <div className="tz-card mb-6">
        <div className="tz-card-title">Contents</div>
        <ol className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5 list-none p-0 text-[13.5px]">
          {[
            ["#overview", "01 · System overview"],
            ["#routing",  "02 · Host-aware routing"],
            ["#routes",   "03 · Frontend route map"],
            ["#data",     "04 · Data model"],
            ["#auth",     "05 · Authentication flow"],
            ["#tracking", "06 · Pageview pipeline"],
            ["#cicd",     "07 · CI / CD"],
            ["#components", "08 · Component inventory"],
            ["#health",   "09 · Health snapshot"],
            ["#backlog",  "10 · Improvement backlog"],
            ["#repo",     "11 · Repository layout"],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} style={{
                color: "var(--tz-ink-dim)", textDecoration: "none",
                display: "block", padding: "4px 0",
              }}>{label}</a>
            </li>
          ))}
        </ol>
      </div>

      {/* 1 */}
      <Section id="overview" num="01" title="System overview">
        <p className="section-p">
          Three hosts, one Vercel project, one Supabase instance. All non-static traffic flows through
          middleware first — host header decides whether the request renders marketing, portal, admin, or auth.
        </p>
        <Mermaid chart={overviewChart} />
      </Section>

      {/* 2 */}
      <Section id="routing" num="02" title="Host-aware routing">
        <p className="section-p">
          One middleware, three hosts. www-side admin/sign-in/auth paths redirect to portal subdomain so the
          auth cookie lives on a single host (no double sign-in). Portal-side passthroughs render literal
          paths; everything else rewrites under <code>/portal/*</code>.
        </p>
        <Mermaid chart={routingChart} />
      </Section>

      {/* 3 */}
      <Section id="routes" num="03" title="Frontend route map">
        <p className="section-p">
          Marketing on www (no auth). Portal on portal subdomain after sign-in. Admin gated by{" "}
          <code>admins</code> table membership. Six programmatic SEO pages under{" "}
          <code>/indicator/[market]</code>.
        </p>
        <Mermaid chart={routesChart} />
      </Section>

      {/* 4 */}
      <Section id="data" num="04" title="Data model · 10 tables">
        <p className="section-p">
          User identity owned by <code>auth.users</code> (Supabase Auth, UUID). Application tables key on{" "}
          <code>user_id text</code> for compatibility with prior Clerk shape — cast at join boundaries. RLS
          enabled on every app table; service-role bypasses for server-side queries only.
        </p>
        <Mermaid chart={dataChart} />
      </Section>

      {/* 5 */}
      <Section id="auth" num="05" title="Authentication flow">
        <p className="section-p">
          All sign-in paths target <code>portal.easytradesetup.com</code>. www-side <code>/sign-in</code> 301s
          to portal before form render so the session cookie always lives on a single host.
        </p>
        <Mermaid chart={authChart} />
      </Section>

      {/* 6 */}
      <Section id="tracking" num="06" title="Pageview tracking pipeline">
        <p className="section-p">
          No raw IP stored. <code>visitor_id</code> = SHA-256 of (salt + IP + UA + day) — rotates daily.
          Bot regex drops crawlers. Skip-list excludes /api, /portal, /admin, /sign-*, /auth.
        </p>
        <Mermaid chart={trackingChart} />
      </Section>

      {/* 7 */}
      <Section id="cicd" num="07" title="CI / CD pipeline">
        <p className="section-p">
          Push to main triggers two parallel paths: GitHub Actions runs unit + e2e for verification; Vercel
          auto-deploys to all three domains.
        </p>
        <Mermaid chart={cicdChart} />
      </Section>

      {/* 8 */}
      <Section id="components" num="08" title="Component inventory">
        <p className="section-p">Where every UI primitive lives.</p>
        <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="tz-table">
            <thead>
              <tr><th>Layer</th><th>Module</th><th>Purpose</th></tr>
            </thead>
            <tbody>
              {components.map(([layer, mod, purpose], i) => (
                <tr key={`${mod}-${i}`}>
                  <td>{layer}</td>
                  <td><code style={{ fontSize: 12 }}>{mod}</code></td>
                  <td>{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 9 */}
      <Section id="health" num="09" title="Health snapshot">
        <p className="section-p">Where everything stands today.</p>
        <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="tz-table">
            <thead>
              <tr><th>Area</th><th style={{ width: 80, textAlign: "center" }}>Status</th><th>Note</th></tr>
            </thead>
            <tbody>
              {health.map((h) => (
                <tr key={h.area}>
                  <td style={{ fontWeight: 500 }}>{h.area}</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{
                      display: "inline-block", width: 10, height: 10, borderRadius: 5,
                      background: statusColor(h.status),
                      boxShadow: `0 0 8px ${statusColor(h.status)}40`,
                    }} aria-label={h.status} />
                  </td>
                  <td style={{ color: "var(--tz-ink-dim)" }}>{h.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 10 */}
      <Section id="backlog" num="10" title="Improvement backlog · 25 items">
        <p className="section-p">Prioritised across P0 → P5. Pick top 3 from P0/P1 each session.</p>
        <div className="flex flex-col gap-4">
          {backlog.map((tier) => (
            <div key={tier.tier} className="tz-card" style={{ borderLeft: `3px solid ${tier.color}` }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono font-bold text-[13px]" style={{ color: tier.color }}>
                  {tier.tier}
                </span>
                <h3 className="font-display font-semibold text-[16px]" style={{ margin: 0, color: "var(--tz-ink)" }}>
                  {tier.title}
                </h3>
              </div>
              <ol className="text-[13.5px]" style={{ color: "var(--tz-ink-dim)", paddingLeft: 20, margin: 0 }}>
                {tier.items.map((it, i) => (
                  <li key={i} style={{ margin: "4px 0" }}>{it}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Section>

      {/* 11 */}
      <Section id="repo" num="11" title="Repository layout">
        <pre style={{
          background: "var(--tz-surface-2)", border: "1px solid var(--tz-border)",
          borderRadius: 10, padding: 16, fontSize: 12, overflowX: "auto",
          color: "var(--tz-ink-dim)", lineHeight: 1.6,
        }}>{`easytradesetup/
├─ landing-page/
│  ├─ app/                    Next.js App Router routes
│  ├─ components/             UI (sections, nav, ui, auth, analytics, seo, admin)
│  ├─ lib/                    Server helpers + constants
│  ├─ supabase/migrations/    SQL migrations 001–005
│  ├─ public/                 Static assets
│  ├─ tests/                  unit (vitest) + e2e (Playwright)
│  ├─ docs/                   ARCHITECTURE.md (source) + architecture.html
│  ├─ middleware.ts           Host-aware routing + auth gate
│  ├─ tailwind.config.ts      Brand tokens (navy + cyan-blue + gold)
│  ├─ next.config.mjs
│  └─ vercel.json
├─ src/pine/                  Golden Indicator Pine v5 source
├─ .github/workflows/test.yml CI workflow
└─ CLAUDE.md                  Project context for AI assistant`}</pre>
      </Section>

      <p className="mt-8 text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>
        Generated 2026-04-26 · Edit landing-page/docs/ARCHITECTURE.md and this page in lockstep.
      </p>
    </>
  );
}

function Section({
  id, num, title, children,
}: {
  id: string; num: string; title: string; children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ scrollMarginTop: 80, paddingBottom: 32, marginBottom: 32, borderBottom: "1px solid var(--tz-border)" }}>
      <div style={{
        font: "600 11px var(--tz-mono)", letterSpacing: "0.14em",
        textTransform: "uppercase", color: "var(--tz-ink-faint)",
        marginBottom: 4,
      }}>
        {num} · Section
      </div>
      <h2 className="font-display font-semibold" style={{
        fontSize: 24, letterSpacing: "-0.02em", margin: "0 0 8px", color: "var(--tz-ink)",
      }}>
        {title}
      </h2>
      <div className="section-body">
        {children}
      </div>
      <style>{`.section-p { color: var(--tz-ink-dim); font-size: 14px; max-width: 880px; margin: 8px 0 16px; }`}</style>
    </section>
  );
}
