// Hand-curated feature timeline shown in /admin/releases.
//
// One entry per shipped milestone — not one per commit. Lives in source
// so it's reviewable in PRs and stays consistent with what actually
// shipped. Reads top-down (newest first).
//
// When you ship a new milestone: prepend a new entry to RELEASES, set
// the same `phase` if it belongs to an in-flight theme, otherwise start
// a new phase. Mark a release as `tag` when you cut a git tag.

export type Tone = "ship" | "fix" | "ops" | "milestone";

export type ReleaseItem = {
  text: string;
  tone?: Tone;
};

export type Release = {
  date: string;       // ISO YYYY-MM-DD
  phase: string;      // e.g. "Pre-indicator launch"
  title: string;      // headline of this release
  tag?: string;       // git tag if cut (e.g. "v1.0-pre-indicator")
  commit?: string;    // short SHA of the head commit on this release
  items: ReleaseItem[];
};

export const RELEASES: Release[] = [
  {
    date: "2026-05-02",
    phase: "Marketing motion + admin tooling",
    title: "Stable build — admin tooling, marketing checklist, brand kit, GA4",
    tag: "v1.1-stable-2026-05-02",
    commit: "098deff",
    items: [
      { tone: "milestone", text: "MILESTONE: site stable. Marketing motion ready. AI-first solo workflow. VAPT pass clean (zero medium+ findings)." },
      { tone: "ship", text: "Brand kit at /admin/brand-kit — interactive HTML reference iframed from admin-only API route. Path-traversal-safe; iframe-scoped relaxed CSP only on this route. Source assets live outside public/." },
      { tone: "ship", text: "Marketing checklist 025+026 — M0-M4 tier scheme. YouTube + Instagram only. AI-drafted weekly batches via Meta Business Suite. Drops paid acquisition, daily cadence, A/B pricing, affiliate program." },
      { tone: "ship", text: "Risk Calculator — bidirectional 'Calculate from' (risk % or position size), market-first ordering, persistent prefs in localStorage." },
      { tone: "ship", text: "GA4 wired via @next/third-parties. Conditional on NEXT_PUBLIC_GA_MEASUREMENT_ID. CSP allowlist updated for analytics + Ads linker collectors." },
      { tone: "ship", text: "BRAND_KIT.md at repo root — colors, fonts, asset specs, AI image-gen prompts. Single source of truth for off-platform creative." },
      { tone: "ship", text: "Admin layout widened 1200px → 1600px. Big-monitor breathing room for tables, charts, iframes." },
      { tone: "ship", text: "Sitemap submitted to Google Search Console + Bing Webmaster Tools. Cron-job.org uptime probe wired with Bearer auth." },
      { tone: "fix", text: "ETS abbreviation removed site-wide — JSON-LD alternateName + OG image badge swapped to canonical BrandMark checkmark." },
      { tone: "fix", text: "Portal subdomain marketing paths (/checkout, /pricing, /sample, …) now 301 to www host instead of 404ing through the /portal/* rewrite." },
      { tone: "fix", text: "First-visit currency mismatch (Hero USD vs Banner INR) — server <Price /> now uses resolveCurrency() with cookie + IP fallback." },
      { tone: "ops", text: "Public-folder security audit — moved internal brand-kit assets out of public/ into admin-assets/. Verified no .env / .git / secrets leaked." },
      { tone: "ops", text: "VAPT pass — TLS 1.3 enforced (1.0/1.1 rejected), HSTS preload, CSP nonce-based + strict-dynamic, BotID actively challenging, all admin / portal routes gated, Stripe webhook signature + idempotency tracking. Zero medium+ findings." },
    ],
  },
  {
    date: "2026-04-29",
    phase: "Pre-indicator launch",
    title: "Site complete — ready to ship indicator + strategy build",
    tag: "v1.0-pre-indicator",
    commit: "3bf706b",
    items: [
      { tone: "milestone", text: "MILESTONE: site, mail, payments, admin, analytics, geo-content all live. Indicator + strategy preparation begins next." },
      { tone: "ship", text: "CTA color cleanup — all primary buttons blue-cyan gradient. Acid green only in semantic LIVE chips." },
      { tone: "ship", text: "Compare teaser on home — 3 rows vs LuxAlgo + TrendSpider, links to full /compare table." },
      { tone: "ship", text: "Early-access scarcity — first 100 buyers receive a personalized welcome video. Ethical, deliverable, no false urgency." },
    ],
  },
  {
    date: "2026-04-29",
    phase: "Pre-indicator launch",
    title: "Cookie consent + GST removed + internal uptime monitor",
    commit: "e8a33c0",
    items: [
      { tone: "ship", text: "GDPR / DPDPA cookie consent banner. Clarity gated until visitor accepts." },
      { tone: "fix", text: "Removed all GST claims from Terms + FAQ — not GST-registered, no false statements." },
      { tone: "ship", text: "Internal uptime monitor — pings 5 critical URLs, stores in Supabase, surfaces at /admin/site-health." },
      { tone: "ops", text: "Vercel cron block dropped (Hobby plan); switched to external cron-job.org trigger with bearer token." },
    ],
  },
  {
    date: "2026-04-29",
    phase: "Pre-indicator launch",
    title: "Mail layer fully wired",
    commit: "0ffc557",
    items: [
      { tone: "ship", text: "Single mailbox: welcome@easytradesetup.com — Zoho receive + Resend transactional send." },
      { tone: "ship", text: "DKIM (Resend + Zoho) + DMARC strict (p=reject; sp=reject; adkim=s; aspf=s)." },
      { tone: "fix", text: "Replaced hello@ → welcome@ across 11 files. Defaults updated so missing env still routes to a real inbox." },
    ],
  },
  {
    date: "2026-04-29",
    phase: "Pre-indicator launch",
    title: "Geo-prioritized content + sample tabs",
    commit: "5d5eb80",
    items: [
      { tone: "ship", text: "Home content reordered by visitor geography — IN sees NIFTY first, global sees SPX first." },
      { tone: "ship", text: "Hero ticker, MultiMarket cards, marquee, lead bullet all swap based on the cookie that already drives currency." },
      { tone: "ship", text: "Single URL preserved (no /in or /us split). hreflang stays valid. SSR-correct on first paint." },
    ],
  },
  {
    date: "2026-04-28",
    phase: "Pre-indicator launch",
    title: "Free sample — 4-market tabs",
    commit: "0ce7ad5",
    items: [
      { tone: "ship", text: "/sample now tabbed: Indian (NIFTY ORB), US (ES pullback), Crypto (BTC range), Gold (XAU overlap)." },
      { tone: "ship", text: "Each tab is a full chapter — intro, one-liner, entry rules, exit rules, invalidation, why-the-edge, risk framework." },
      { tone: "ship", text: "Mobile tabs scroll horizontally; deep-link via ?market=us." },
    ],
  },
  {
    date: "2026-04-28",
    phase: "Pre-indicator launch",
    title: "Microsoft Clarity wired + /admin/analytics",
    commit: "03e5463",
    items: [
      { tone: "ship", text: "Heatmaps, session recordings, funnels via Clarity — free unlimited tier." },
      { tone: "fix", text: "React #418 hydration mismatch fixed by switching to next/script afterInteractive." },
      { tone: "ship", text: "/admin/analytics page with Data Export API — top pages, geo + source, devices. Deep-links to Clarity for heatmaps." },
    ],
  },
  {
    date: "2026-04-28",
    phase: "Pre-indicator launch",
    title: "Nav simplification — kill /resources",
    commit: "e69652a",
    items: [
      { tone: "ship", text: "/resources retired — was a sales-page-disguised-as-docs hub. 308 redirect to /product." },
      { tone: "ship", text: "TopNav slimmed to 3 items: Features · Free sample · Pricing." },
      { tone: "ship", text: "Customer-only items keep their portal home. Public canonicals (/sample, /docs/install, /legal/disclaimer) untouched." },
    ],
  },
  {
    date: "2026-04-28",
    phase: "Pre-indicator launch",
    title: "OG image redesign + SEO + a11y fixes",
    commit: "e569da7",
    items: [
      { tone: "ship", text: "OG image redesigned for thumbnail legibility (WhatsApp / iMessage)." },
      { tone: "fix", text: "Pricing strikethrough rendering same value in SSR — fixed via server-rendered <Price>." },
      { tone: "fix", text: "Meta description trimmed 396→155 chars (Google SERP truncation)." },
      { tone: "ship", text: "Added FAQPage + SoftwareApplication JSON-LD to home; FAQ list exported so JSON-LD never drifts from visible UI." },
      { tone: "ops", text: "robots.txt blocks 17 AI scrapers (GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, ...)." },
    ],
  },
  {
    date: "2026-04-27",
    phase: "Pre-indicator launch",
    title: "Portal UX rebuild — brand-aligned palette",
    commit: "3c39b52",
    items: [
      { tone: "ship", text: "Customer portal rebuilt with the same dark / glass / aurora system as marketing." },
      { tone: "ship", text: "/portal/dashboard, /portal/downloads, /portal/support, /portal/updates, /portal/account live." },
      { tone: "ship", text: "PortalMobileNav with brand-consistent header + footer." },
    ],
  },
  {
    date: "2026-04-26",
    phase: "Pre-launch CRO",
    title: "Home trimmed from 12 sections to 7",
    commit: "3dd72c9",
    items: [
      { tone: "ship", text: "Home composition: Hero → CleanVsNoisy → Bundle → MultiMarket → CompareTeaser → FAQTeaser → PricingTeaser → FinalCTA." },
      { tone: "ship", text: "Killed Solution, TheLoop, WhatItShows, WhoFor, WhyDifferent — content folded into existing sections or moved to /product." },
    ],
  },
  {
    date: "2026-04-26",
    phase: "Pre-launch CRO",
    title: "Mobile + nav cleanup, portal-marketing parity, disclaimer strip",
    commit: "40ebb81",
    items: [
      { tone: "ship", text: "Sticky buy bar on mobile; ExitIntent modal on desktop." },
      { tone: "ship", text: "Risk disclosure strip above footer on every page." },
      { tone: "ship", text: "TopNav + Footer use consistent copy across marketing + portal." },
    ],
  },
  {
    date: "2026-04-26",
    phase: "Pre-launch CRO",
    title: "Hero — 3-screen live ticker slider",
    commit: "eabd755",
    items: [
      { tone: "ship", text: "Hero now rotates between NIFTY, Gold, US30 with live quotes from Yahoo Finance." },
      { tone: "ship", text: "Auto-rotate every 5s; pauses on hover; respects prefers-reduced-motion." },
      { tone: "ship", text: "Sparkline + price + change + market-state chip on every slide." },
    ],
  },
  {
    date: "2026-04-26",
    phase: "Pre-launch CRO",
    title: "Quotes API — multi-source rotation",
    commit: "0fffecf",
    items: [
      { tone: "ship", text: "/api/quotes pulls from Yahoo first, falls back to Stooq, then last-known cache." },
      { tone: "ship", text: "Hero ticker stays useful even when Yahoo rate-limits or is down." },
    ],
  },
  {
    date: "2026-04-25",
    phase: "Foundation",
    title: "Test gate, admin tools, soft-delete entitlements",
    items: [
      { tone: "ship", text: "Vercel build runs 'npm test && next build' — failed unit test gates production deploy." },
      { tone: "ship", text: "Generic <DataTable<T>> in admin — search, sort, filter chips, pagination, CSV, mobile cards. Used by every admin list." },
      { tone: "ship", text: "Soft-delete pattern for entitlements: revoked_at / revoked_by / revoke_reason. Two-click confirm with 5-sec auto-disarm." },
      { tone: "ship", text: "/admin/qa runs 50+ checks across Build / Env / Security / Functional / SEO / DB / Pricing / UX." },
      { tone: "ship", text: "/admin/readiness — launch checklist with auto-detect + manual ack. 9 blockers + 8 warnings tracked." },
    ],
  },
  {
    date: "2026-04-22",
    phase: "Foundation",
    title: "Strict CSP nonce + security hardening",
    items: [
      { tone: "ship", text: "Per-request CSP nonce in middleware. 'strict-dynamic' + nonce. No 'unsafe-inline'. No 'unsafe-eval'." },
      { tone: "ship", text: "HSTS preload + COOP same-origin + CORP same-site + X-Frame-Options DENY + Permissions-Policy locked down." },
      { tone: "ship", text: "Rate limit + BotID on /api/lead. Rate limit on /api/stripe/checkout (5/min)." },
      { tone: "ship", text: "Stripe webhook signature verification (constructEvent)." },
    ],
  },
  {
    date: "2026-04-21",
    phase: "Foundation",
    title: "Single-currency pricing source of truth",
    items: [
      { tone: "ship", text: "lib/pricing.ts is the single source. USD_TO_INR=93.17 anchor. Unit test enforces ±20% drift." },
      { tone: "ship", text: "Permanent launch price ($49 / ₹4,599) — 67% off retail, always. No countdown, no expiry." },
      { tone: "ship", text: "Geo-aware <Price> server component reads cookie via next/headers — SSR-correct, no flash." },
    ],
  },
  {
    date: "2026-04-20",
    phase: "Foundation",
    title: "Repo bootstrap — Next 15.5 + React 19 + TypeScript 5.7",
    items: [
      { tone: "ship", text: "Next.js App Router project at landing-page/. Tailwind 3.4 with custom semantic tokens." },
      { tone: "ship", text: "Supabase Auth + RLS + service-role admin client." },
      { tone: "ship", text: "Stripe Checkout Sessions (USD + INR cross-border). UAE Stripe account live." },
      { tone: "ship", text: "Resend transactional email (DKIM + SPF on Cloudflare DNS)." },
      { tone: "ship", text: "Sitemap (14 routes), JSON-LD schema (Organization + WebSite + Product + Breadcrumb)." },
      { tone: "ship", text: "Dark theme with aurora backdrop + glass cards + grain texture. Mobile-first." },
    ],
  },
];
