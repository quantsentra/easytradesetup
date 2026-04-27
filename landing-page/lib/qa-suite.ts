import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import {
  USD_TO_INR,
  RETAIL_USD,
  RETAIL_INR,
  OFFER_USD,
  OFFER_INR,
} from "@/lib/pricing";

// Comprehensive QA suite — runs ~50 checks across 8 dimensions and returns
// a structured report that persists to the qa_runs table. Designed to be
// runnable from a Vercel function (no shell, no playwright). Heavy local
// suites (build, e2e, lighthouse) stay separate; this is the "go-live
// readiness gate" check operators run before each push.

export type CheckStatus = "pass" | "warn" | "fail";

export type CheckResult = {
  id: string;          // stable slug — survives reordering, used for diff vs prior run
  category: Category;
  name: string;
  status: CheckStatus;
  detail: string;      // one-line summary surfaced in row
  fix?: string;        // optional remediation hint
  durationMs: number;
};

export const CATEGORIES = [
  "Build",
  "Env",
  "Security",
  "Functional",
  "SEO",
  "Database",
  "Pricing",
  "UX",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type SuiteResult = {
  ranAt: string;
  version: string;
  gitSha: string | null;
  vercelEnv: string;
  origin: string;
  durationMs: number;
  totals: { total: number; passed: number; warned: number; failed: number };
  results: CheckResult[];
};

type CheckBuilder = () => Promise<Omit<CheckResult, "durationMs">>;
type Step = { id: string; category: Category; name: string; run: CheckBuilder };

// Per-fetch hard ceiling — slow/locked tests should fail fast, not timeout the whole run.
const FETCH_TIMEOUT_MS = 8_000;

async function timed<T extends Omit<CheckResult, "durationMs">>(builder: () => Promise<T>): Promise<CheckResult> {
  const start = Date.now();
  try {
    const partial = await builder();
    return { ...partial, durationMs: Date.now() - start };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      id: "internal.error",
      category: "Build",
      name: "Suite runner",
      status: "fail",
      detail: `Check threw: ${msg}`,
      durationMs: Date.now() - start,
    };
  }
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctl.signal, cache: "no-store", redirect: "manual" });
  } finally {
    clearTimeout(t);
  }
}

// ---------- BUILD / VERSION ------------------------------------------------

const buildSteps = (): Step[] => [
  {
    id: "build.package-version",
    category: "Build",
    name: "Package version pinned",
    run: async () => {
      // package.json version doesn't ride into the bundle; fall back to env.
      const v = process.env.npm_package_version || "unknown";
      const ok = v !== "unknown";
      return {
        id: "build.package-version",
        category: "Build",
        name: "Package version pinned",
        status: ok ? "pass" : "warn",
        detail: ok ? `v${v}` : "npm_package_version not set in runtime env",
      };
    },
  },
  {
    id: "build.git-sha",
    category: "Build",
    name: "Git commit SHA available",
    run: async () => {
      const sha = process.env.VERCEL_GIT_COMMIT_SHA || null;
      return {
        id: "build.git-sha",
        category: "Build",
        name: "Git commit SHA available",
        status: sha ? "pass" : "warn",
        detail: sha ? sha.slice(0, 7) : "Not running on Vercel — local dev",
      };
    },
  },
  {
    id: "build.vercel-env",
    category: "Build",
    name: "Vercel environment",
    run: async () => {
      const env = process.env.VERCEL_ENV || "local";
      return {
        id: "build.vercel-env",
        category: "Build",
        name: "Vercel environment",
        status: env === "production" ? "pass" : env === "local" ? "warn" : "pass",
        detail: env,
      };
    },
  },
  {
    id: "build.node-version",
    category: "Build",
    name: "Node.js runtime ≥ 20",
    run: async () => {
      const v = process.versions.node;
      const major = parseInt(v.split(".")[0], 10);
      const ok = major >= 20;
      return {
        id: "build.node-version",
        category: "Build",
        name: "Node.js runtime ≥ 20",
        status: ok ? "pass" : "fail",
        detail: `Node ${v}`,
        fix: ok ? undefined : "Upgrade Vercel project to Node 20+ in Settings → Build & Dev",
      };
    },
  },
];

// ---------- ENV / CONFIG ---------------------------------------------------

function envCheck(
  id: string,
  name: string,
  envKeys: string[],
  required: boolean,
  fix?: string,
): Step {
  return {
    id,
    category: "Env",
    name,
    run: async () => {
      const found = envKeys.find((k) => process.env[k]);
      if (found) {
        const val = process.env[found] || "";
        return {
          id, category: "Env", name,
          status: "pass",
          detail: `${found} set (${val.length} chars)`,
        };
      }
      return {
        id, category: "Env", name,
        status: required ? "fail" : "warn",
        detail: `Missing: ${envKeys.join(" / ")}`,
        fix,
      };
    },
  };
}

const envSteps = (): Step[] => [
  envCheck("env.stripe-secret",   "Stripe secret key",        ["STRIPE_SECRET_KEY"], true,
    "Set STRIPE_SECRET_KEY in Vercel env (live mode for production)"),
  envCheck("env.stripe-webhook",  "Stripe webhook secret",    ["STRIPE_WEBHOOK_SECRET"], true,
    "Create webhook in Stripe → reveal signing secret → set STRIPE_WEBHOOK_SECRET"),
  envCheck("env.stripe-publishable", "Stripe publishable key", ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"], false,
    "Optional unless you embed Stripe Elements client-side"),
  envCheck("env.supabase-url",    "Supabase URL",             ["NEXT_PUBLIC_SUPABASE_URL"], true),
  envCheck("env.supabase-anon",   "Supabase anon key",        ["NEXT_PUBLIC_SUPABASE_ANON_KEY"], true),
  envCheck("env.supabase-service","Supabase service-role key", ["SUPABASE_SERVICE_ROLE_KEY"], true,
    "Required for webhook fulfilment, admin routes, and entitlement writes"),
  envCheck("env.resend",          "Resend API key",           ["RESEND_API_KEY"], true,
    "Welcome / receipt / admin notification emails depend on this"),
  envCheck("env.purchase-from",   "Purchase email sender",    ["PURCHASE_FROM_EMAIL"], false,
    "Defaults to onboarding@resend.dev (sandbox sender — high spam rate). Set to welcome@easytradesetup.com after verifying domain in Resend"),
  envCheck("env.admin-notify",    "Admin notification email", ["ADMIN_NOTIFY_EMAIL"], false,
    "Optional — set to receive a Slack-like 'New sale' email on each purchase"),
  envCheck("env.sentry-dsn",      "Sentry DSN",               ["NEXT_PUBLIC_SENTRY_DSN", "SENTRY_DSN"], false,
    "Without DSN, runtime exceptions don't reach the Errors panel"),
  envCheck("env.sentry-org-token","Sentry source-map upload", ["SENTRY_AUTH_TOKEN"], false,
    "Optional — without it stacktraces in production show minified line numbers"),
];

// ---------- FUNCTIONAL (HTTP) ---------------------------------------------

function httpStatusCheck(
  id: string,
  name: string,
  path: string,
  origin: string,
  acceptable: number[],
  expectBodyToInclude?: string,
): Step {
  return {
    id, category: "Functional", name,
    run: async () => {
      const url = `${origin}${path}`;
      try {
        const res = await fetchWithTimeout(url);
        const okStatus = acceptable.includes(res.status);
        let bodyOk = true;
        let bodyDetail = "";
        if (expectBodyToInclude) {
          const text = await res.text();
          bodyOk = text.includes(expectBodyToInclude);
          if (!bodyOk) bodyDetail = ` — body missing "${expectBodyToInclude}"`;
        }
        const ok = okStatus && bodyOk;
        return {
          id, category: "Functional", name,
          status: ok ? "pass" : "fail",
          detail: `${res.status}${bodyDetail}`,
          fix: ok ? undefined : `Expected one of [${acceptable.join(", ")}] — got ${res.status}`,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return {
          id, category: "Functional", name,
          status: "fail",
          detail: `fetch failed: ${msg}`,
          fix: "Page or API route is throwing or timing out",
        };
      }
    },
  };
}

const functionalSteps = (origin: string): Step[] => [
  httpStatusCheck("fn.home",      "GET /",                   "/",                 origin, [200]),
  httpStatusCheck("fn.pricing",   "GET /pricing",            "/pricing",          origin, [200]),
  httpStatusCheck("fn.product",   "GET /product",            "/product",          origin, [200]),
  httpStatusCheck("fn.compare",   "GET /compare",            "/compare",          origin, [200]),
  httpStatusCheck("fn.faq",       "GET /docs/faq",           "/docs/faq",         origin, [200]),
  httpStatusCheck("fn.install",   "GET /docs/install",       "/docs/install",     origin, [200]),
  httpStatusCheck("fn.sample",    "GET /sample",             "/sample",           origin, [200]),
  httpStatusCheck("fn.checkout",  "GET /checkout",           "/checkout",         origin, [200, 303, 307, 308]),
  httpStatusCheck("fn.thanks",    "GET /thank-you",          "/thank-you",        origin, [200]),
  httpStatusCheck("fn.legal-terms","GET /legal/terms",       "/legal/terms",      origin, [200]),
  httpStatusCheck("fn.legal-priv","GET /legal/privacy",      "/legal/privacy",    origin, [200]),
  httpStatusCheck("fn.legal-disc","GET /legal/disclaimer",   "/legal/disclaimer", origin, [200]),
  httpStatusCheck("fn.legal-ref", "GET /legal/refund",       "/legal/refund",     origin, [200]),
  httpStatusCheck("fn.sitemap",   "GET /sitemap.xml",        "/sitemap.xml",      origin, [200], "<urlset"),
  httpStatusCheck("fn.robots",    "GET /robots.txt",         "/robots.txt",       origin, [200]),
  httpStatusCheck("fn.health",    "GET /api/health",         "/api/health",       origin, [200, 503]),
  {
    id: "fn.health-ok",
    category: "Functional",
    name: "/api/health reports OK",
    run: async () => {
      try {
        const res = await fetchWithTimeout(`${origin}/api/health`);
        const json = (await res.json()) as { ok: boolean; checks?: Record<string, unknown> };
        return {
          id: "fn.health-ok",
          category: "Functional",
          name: "/api/health reports OK",
          status: json.ok ? "pass" : "fail",
          detail: json.ok ? "All subsystems healthy" : "One or more subsystems unhealthy",
          fix: json.ok ? undefined : "Drill into /api/health response for failing subsystem",
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return {
          id: "fn.health-ok",
          category: "Functional",
          name: "/api/health reports OK",
          status: "fail",
          detail: `parse failed: ${msg}`,
        };
      }
    },
  },
];

// ---------- SECURITY HEADERS ----------------------------------------------

type HeaderRule = {
  id: string;
  name: string;
  header: string;
  expect: (value: string | null) => boolean;
  detail: (value: string | null) => string;
  fix?: string;
};

const headerRules: HeaderRule[] = [
  {
    id: "sec.csp",
    name: "Content-Security-Policy",
    header: "content-security-policy",
    expect: (v) => !!v && /default-src 'self'/.test(v) && /frame-ancestors 'none'/.test(v),
    detail: (v) => v ? `${v.length} chars · frame-ancestors: ${/frame-ancestors 'none'/.test(v) ? "none" : "missing"}` : "missing",
    fix: "Set in next.config.mjs securityHeaders",
  },
  {
    id: "sec.x-frame-options",
    name: "X-Frame-Options: DENY",
    header: "x-frame-options",
    expect: (v) => v === "DENY",
    detail: (v) => v || "missing",
  },
  {
    id: "sec.hsts",
    name: "Strict-Transport-Security ≥ 1y + preload",
    header: "strict-transport-security",
    expect: (v) => !!v && /max-age=\d{7,}/.test(v) && /preload/.test(v),
    detail: (v) => v || "missing",
  },
  {
    id: "sec.referrer",
    name: "Referrer-Policy: strict-origin-when-cross-origin",
    header: "referrer-policy",
    expect: (v) => v === "strict-origin-when-cross-origin",
    detail: (v) => v || "missing",
  },
  {
    id: "sec.nosniff",
    name: "X-Content-Type-Options: nosniff",
    header: "x-content-type-options",
    expect: (v) => v === "nosniff",
    detail: (v) => v || "missing",
  },
  {
    id: "sec.permissions",
    name: "Permissions-Policy locks risky APIs",
    header: "permissions-policy",
    expect: (v) => !!v && /interest-cohort=\(\)/.test(v),
    detail: (v) => v ? `${v.length} chars` : "missing",
  },
  {
    id: "sec.no-powered",
    name: "X-Powered-By header removed",
    header: "x-powered-by",
    expect: (v) => v === null,
    detail: (v) => v ? `leaked: ${v}` : "absent (good)",
    fix: "Set poweredByHeader: false in next.config.mjs",
  },
];

const securitySteps = (origin: string): Step[] => [
  {
    id: "sec.fetch",
    category: "Security",
    name: "Security headers reachable",
    run: async () => {
      try {
        await fetchWithTimeout(`${origin}/`);
        return { id: "sec.fetch", category: "Security", name: "Security headers reachable", status: "pass", detail: "Home page returned headers" };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return { id: "sec.fetch", category: "Security", name: "Security headers reachable", status: "fail", detail: msg };
      }
    },
  },
  ...headerRules.map<Step>((rule) => ({
    id: rule.id,
    category: "Security",
    name: rule.name,
    run: async () => {
      const res = await fetchWithTimeout(`${origin}/`);
      const v = res.headers.get(rule.header);
      const ok = rule.expect(v);
      return {
        id: rule.id,
        category: "Security",
        name: rule.name,
        status: ok ? "pass" : "fail",
        detail: rule.detail(v),
        fix: ok ? undefined : rule.fix,
      };
    },
  })),
];

// ---------- SEO ------------------------------------------------------------

const seoSteps = (origin: string): Step[] => [
  {
    id: "seo.home-html",
    category: "SEO",
    name: "Home renders complete HTML",
    run: async () => {
      const res = await fetchWithTimeout(`${origin}/`);
      const html = await res.text();
      const ok = res.ok && html.length > 5_000 && html.includes("</html>");
      return {
        id: "seo.home-html", category: "SEO", name: "Home renders complete HTML",
        status: ok ? "pass" : "fail",
        detail: `${html.length.toLocaleString()} bytes, status ${res.status}`,
      };
    },
  },
  {
    id: "seo.title",
    category: "SEO",
    name: "Home <title> ≥ 20 chars",
    run: async () => {
      const html = await (await fetchWithTimeout(`${origin}/`)).text();
      const match = html.match(/<title>([^<]+)<\/title>/);
      const title = match?.[1]?.trim() || "";
      const ok = title.length >= 20 && title.length <= 70;
      return {
        id: "seo.title", category: "SEO", name: "Home <title> ≥ 20 chars",
        status: ok ? "pass" : "fail",
        detail: title ? `"${title}" (${title.length} ch)` : "no <title>",
        fix: ok ? undefined : "Set metadata.title in app/layout.tsx — aim for 50–60 chars",
      };
    },
  },
  {
    id: "seo.description",
    category: "SEO",
    name: "Meta description ≥ 80 chars",
    run: async () => {
      const html = await (await fetchWithTimeout(`${origin}/`)).text();
      const match = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
      const desc = match?.[1]?.trim() || "";
      const ok = desc.length >= 80 && desc.length <= 200;
      return {
        id: "seo.description", category: "SEO", name: "Meta description ≥ 80 chars",
        status: ok ? "pass" : desc ? "warn" : "fail",
        detail: desc ? `${desc.length} chars` : "missing",
      };
    },
  },
  {
    id: "seo.canonical",
    category: "SEO",
    name: "Canonical URL set",
    run: async () => {
      const html = await (await fetchWithTimeout(`${origin}/`)).text();
      const ok = /<link\s+rel="canonical"\s+href=/.test(html);
      return {
        id: "seo.canonical", category: "SEO", name: "Canonical URL set",
        status: ok ? "pass" : "warn",
        detail: ok ? "present" : "no <link rel=\"canonical\">",
      };
    },
  },
  {
    id: "seo.og-image",
    category: "SEO",
    name: "Open Graph image set",
    run: async () => {
      const html = await (await fetchWithTimeout(`${origin}/`)).text();
      const ok = /property="og:image"/.test(html);
      return {
        id: "seo.og-image", category: "SEO", name: "Open Graph image set",
        status: ok ? "pass" : "warn",
        detail: ok ? "present" : "no og:image",
      };
    },
  },
  {
    id: "seo.json-ld-product",
    category: "SEO",
    name: "JSON-LD Product schema",
    run: async () => {
      const html = await (await fetchWithTimeout(`${origin}/`)).text();
      const ok = /"@type"\s*:\s*"Product"/.test(html);
      return {
        id: "seo.json-ld-product", category: "SEO", name: "JSON-LD Product schema",
        status: ok ? "pass" : "warn",
        detail: ok ? "present" : "no Product schema",
        fix: ok ? undefined : "Add JSON-LD Product to home — drives rich product results",
      };
    },
  },
  {
    id: "seo.json-ld-org",
    category: "SEO",
    name: "JSON-LD Organization schema",
    run: async () => {
      const html = await (await fetchWithTimeout(`${origin}/`)).text();
      const ok = /"@type"\s*:\s*"Organization"/.test(html);
      return {
        id: "seo.json-ld-org", category: "SEO", name: "JSON-LD Organization schema",
        status: ok ? "pass" : "warn",
        detail: ok ? "present" : "no Organization schema",
      };
    },
  },
  {
    id: "seo.sitemap-routes",
    category: "SEO",
    name: "Sitemap lists ≥ 14 URLs",
    run: async () => {
      const text = await (await fetchWithTimeout(`${origin}/sitemap.xml`)).text();
      const matches = text.match(/<url>/g) || [];
      const ok = matches.length >= 14;
      return {
        id: "seo.sitemap-routes", category: "SEO", name: "Sitemap lists ≥ 14 URLs",
        status: ok ? "pass" : "fail",
        detail: `${matches.length} URLs`,
      };
    },
  },
  {
    id: "seo.robots-allows",
    category: "SEO",
    name: "robots.txt allows search engines",
    run: async () => {
      // Parse the file into per-user-agent blocks. Only flag a fail when
      // the wildcard "*" group blocks everything — selective Disallow:/
      // entries against named bots (GPTBot, CCBot, etc.) are intentional.
      const text = await (await fetchWithTimeout(`${origin}/robots.txt`)).text();
      const lines = text.split(/\r?\n/);
      let currentAgents: string[] = [];
      const blocks = new Map<string, string[]>(); // ua → directives
      for (const raw of lines) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const m = line.match(/^([A-Za-z-]+):\s*(.*)$/);
        if (!m) continue;
        const [, key, val] = m;
        const lkey = key.toLowerCase();
        if (lkey === "user-agent") {
          currentAgents = currentAgents.length === 0 || blocks.has(currentAgents[0])
            ? [val]
            : [...currentAgents, val];
        } else if (lkey === "allow" || lkey === "disallow") {
          for (const ua of currentAgents) {
            const arr = blocks.get(ua) || [];
            arr.push(`${lkey}:${val}`);
            blocks.set(ua, arr);
          }
          // Reset agent group once a directive lands so the next User-agent
          // line starts a fresh group.
          if (currentAgents.length > 0) currentAgents = [...currentAgents];
        }
      }
      const wild = blocks.get("*") || [];
      const wildBlocksRoot = wild.some((d) => /^disallow:\s*\/\s*$/i.test(d));
      const ok = !wildBlocksRoot && wild.length > 0;
      return {
        id: "seo.robots-allows", category: "SEO", name: "robots.txt allows search engines",
        status: ok ? "pass" : "fail",
        detail: ok
          ? `User-agent: * has ${wild.length} directive(s); root not blocked`
          : wildBlocksRoot
            ? "Wildcard User-agent: * has Disallow: / — search engines blocked"
            : "No User-agent: * group found",
      };
    },
  },
];

// ---------- DATABASE -------------------------------------------------------

const databaseSteps = (): Step[] => [
  {
    id: "db.connection",
    category: "Database",
    name: "Supabase service-role connection",
    run: async () => {
      try {
        const supa = createSupabaseAdmin();
        const { error } = await supa.from("entitlements").select("user_id", { head: true, count: "exact" }).limit(1);
        if (error) throw error;
        return { id: "db.connection", category: "Database", name: "Supabase service-role connection", status: "pass", detail: "Connected" };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return {
          id: "db.connection", category: "Database", name: "Supabase service-role connection",
          status: "fail",
          detail: msg,
          fix: "Check NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in Vercel env",
        };
      }
    },
  },
  {
    id: "db.entitlements-table",
    category: "Database",
    name: "entitlements table",
    run: async () => {
      try {
        const supa = createSupabaseAdmin();
        const { count, error } = await supa.from("entitlements").select("*", { head: true, count: "exact" });
        if (error) throw error;
        return {
          id: "db.entitlements-table", category: "Database", name: "entitlements table",
          status: "pass", detail: `${count ?? 0} rows`,
        };
      } catch (e) {
        return {
          id: "db.entitlements-table", category: "Database", name: "entitlements table",
          status: "fail", detail: e instanceof Error ? e.message : String(e),
        };
      }
    },
  },
  {
    id: "db.stripe-events-table",
    category: "Database",
    name: "stripe_events table (migration 019)",
    run: async () => {
      try {
        const supa = createSupabaseAdmin();
        const { count, error } = await supa.from("stripe_events").select("*", { head: true, count: "exact" });
        if (error) throw error;
        return {
          id: "db.stripe-events-table", category: "Database", name: "stripe_events table (migration 019)",
          status: "pass", detail: `${count ?? 0} events tracked`,
        };
      } catch (e) {
        return {
          id: "db.stripe-events-table", category: "Database", name: "stripe_events table (migration 019)",
          status: "fail",
          detail: e instanceof Error ? e.message : String(e),
          fix: "Run supabase/migrations/019_stripe.sql in Supabase SQL Editor",
        };
      }
    },
  },
  {
    id: "db.entitlements-stripe-cols",
    category: "Database",
    name: "entitlements has stripe_session_id",
    run: async () => {
      try {
        const supa = createSupabaseAdmin();
        const { error } = await supa.from("entitlements").select("stripe_session_id, amount_cents, currency").limit(1);
        if (error) throw error;
        return {
          id: "db.entitlements-stripe-cols", category: "Database", name: "entitlements has stripe_session_id",
          status: "pass", detail: "Migration 019 applied",
        };
      } catch (e) {
        return {
          id: "db.entitlements-stripe-cols", category: "Database", name: "entitlements has stripe_session_id",
          status: "fail",
          detail: e instanceof Error ? e.message : String(e),
          fix: "Apply migration 019_stripe.sql — fulfilment will run with reduced metadata otherwise",
        };
      }
    },
  },
  {
    id: "db.mvp-tasks",
    category: "Database",
    name: "mvp_tasks tracking table",
    run: async () => {
      try {
        const supa = createSupabaseAdmin();
        const { count, error } = await supa.from("mvp_tasks").select("*", { head: true, count: "exact" });
        if (error) throw error;
        return {
          id: "db.mvp-tasks", category: "Database", name: "mvp_tasks tracking table",
          status: "pass", detail: `${count ?? 0} tasks`,
        };
      } catch (e) {
        return {
          id: "db.mvp-tasks", category: "Database", name: "mvp_tasks tracking table",
          status: "warn",
          detail: e instanceof Error ? e.message : String(e),
        };
      }
    },
  },
  {
    id: "db.qa-runs",
    category: "Database",
    name: "qa_runs table (migration 020)",
    run: async () => {
      try {
        const supa = createSupabaseAdmin();
        const { error } = await supa.from("qa_runs").select("id", { head: true, count: "exact" }).limit(1);
        if (error) throw error;
        return {
          id: "db.qa-runs", category: "Database", name: "qa_runs table (migration 020)",
          status: "pass", detail: "Present — version-controlled runs persisted",
        };
      } catch (e) {
        return {
          id: "db.qa-runs", category: "Database", name: "qa_runs table (migration 020)",
          status: "fail",
          detail: e instanceof Error ? e.message : String(e),
          fix: "Run supabase/migrations/020_qa_runs.sql",
        };
      }
    },
  },
];

// ---------- PRICING / LAUNCH ----------------------------------------------

const pricingSteps = (): Step[] => [
  {
    id: "price.fx-retail",
    category: "Pricing",
    name: "Retail INR within ±20% of FX-implied",
    run: async () => {
      const implied = RETAIL_USD * USD_TO_INR;
      const drift = Math.abs(RETAIL_INR - implied) / implied;
      const ok = drift <= 0.20;
      return {
        id: "price.fx-retail", category: "Pricing", name: "Retail INR within ±20% of FX-implied",
        status: ok ? "pass" : "warn",
        detail: `${RETAIL_USD} USD ≈ ${Math.round(implied).toLocaleString("en-IN")} INR · listed ₹${RETAIL_INR.toLocaleString("en-IN")} · drift ${(drift * 100).toFixed(1)}%`,
        fix: ok ? undefined : "Refresh USD_TO_INR or adjust RETAIL_INR in lib/pricing.ts",
      };
    },
  },
  {
    id: "price.fx-offer",
    category: "Pricing",
    name: "Offer INR within ±20% of FX-implied",
    run: async () => {
      const implied = OFFER_USD * USD_TO_INR;
      const drift = Math.abs(OFFER_INR - implied) / implied;
      const ok = drift <= 0.20;
      return {
        id: "price.fx-offer", category: "Pricing", name: "Offer INR within ±20% of FX-implied",
        status: ok ? "pass" : "warn",
        detail: `${OFFER_USD} USD ≈ ${Math.round(implied).toLocaleString("en-IN")} INR · listed ₹${OFFER_INR.toLocaleString("en-IN")} · drift ${(drift * 100).toFixed(1)}%`,
      };
    },
  },
  {
    id: "price.offer-lt-retail",
    category: "Pricing",
    name: "Offer price < retail price (USD + INR)",
    run: async () => {
      const ok = OFFER_USD < RETAIL_USD && OFFER_INR < RETAIL_INR;
      return {
        id: "price.offer-lt-retail", category: "Pricing", name: "Offer price < retail price (USD + INR)",
        status: ok ? "pass" : "fail",
        detail: ok ? `$${OFFER_USD} < $${RETAIL_USD} · ₹${OFFER_INR} < ₹${RETAIL_INR}` : "Offer pricing must be below retail",
      };
    },
  },
  {
    id: "price.fx-anchor-fresh",
    category: "Pricing",
    name: "FX anchor sane (60–95 INR/USD)",
    run: async () => {
      const ok = USD_TO_INR >= 60 && USD_TO_INR <= 95;
      return {
        id: "price.fx-anchor-fresh", category: "Pricing", name: "FX anchor sane (60–95 INR/USD)",
        status: ok ? "pass" : "warn",
        detail: `USD_TO_INR = ${USD_TO_INR}`,
      };
    },
  },
  {
    id: "price.permanent-discount",
    category: "Pricing",
    name: "Launch price discount messaging coherent",
    run: async () => {
      // Permanent-launch-price model: just verify offer < retail and the
      // discount is in a reasonable range (50-80% off) so copy stays honest.
      const ratio = 1 - OFFER_USD / RETAIL_USD;
      const ok = ratio >= 0.5 && ratio <= 0.8;
      return {
        id: "price.permanent-discount", category: "Pricing", name: "Launch price discount messaging coherent",
        status: ok ? "pass" : "warn",
        detail: `${Math.round(ratio * 100)}% off retail · $${OFFER_USD} vs $${RETAIL_USD}`,
        fix: ok ? undefined : "Adjust OFFER_USD or RETAIL_USD so the discount sits between 50% and 80% — current copy says 67%",
      };
    },
  },
];

// ---------- UX (home page copy contracts) ---------------------------------

function bodyContains(id: string, name: string, origin: string, needle: RegExp, status: CheckStatus = "fail"): Step {
  return {
    id, category: "UX", name,
    run: async () => {
      const html = await (await fetchWithTimeout(`${origin}/`)).text();
      const ok = needle.test(html);
      return {
        id, category: "UX", name,
        status: ok ? "pass" : status,
        detail: ok ? "present" : `pattern not found: ${needle.source}`,
      };
    },
  };
}

const uxSteps = (origin: string): Step[] => [
  bodyContains("ux.brand",        "Home mentions Golden Indicator",   origin, /golden indicator/i),
  bodyContains("ux.lifetime",     "Home mentions lifetime updates",   origin, /lifetime/i),
  bodyContains("ux.free-sample",  "Home links to free sample",        origin, /\/sample/i),
  bodyContains("ux.checkout-cta", "Home links to /checkout",          origin, /\/checkout/i),
  bodyContains("ux.no-fake-review","No fake testimonials marker",     origin, /^(?!.*"customers love it").*/is, "warn"),
  bodyContains("ux.no-refund-old","Old '7-day refund' copy removed",  origin, /^(?!.*7[- ]day refund).*/is),
  bodyContains("ux.disclaimer",   "Disclaimer / educational marker",  origin, /educational|not investment advice|disclaimer/i, "warn"),
];

// ---------- SUITE ASSEMBLY -------------------------------------------------

export async function runSuite(origin: string): Promise<SuiteResult> {
  const start = Date.now();

  const steps: Step[] = [
    ...buildSteps(),
    ...envSteps(),
    ...databaseSteps(),
    ...functionalSteps(origin),
    ...securitySteps(origin),
    ...seoSteps(origin),
    ...pricingSteps(),
    ...uxSteps(origin),
  ];

  // Run in parallel batches of 8 — keeps total walltime ≈ slowest 8 in flight.
  const results: CheckResult[] = [];
  const concurrency = 8;
  for (let i = 0; i < steps.length; i += concurrency) {
    const batch = steps.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map((s) => timed(s.run)));
    results.push(...batchResults);
  }

  const totals = {
    total: results.length,
    passed: results.filter((r) => r.status === "pass").length,
    warned: results.filter((r) => r.status === "warn").length,
    failed: results.filter((r) => r.status === "fail").length,
  };

  return {
    ranAt: new Date().toISOString(),
    version: process.env.npm_package_version || "unknown",
    gitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
    vercelEnv: process.env.VERCEL_ENV || "local",
    origin,
    durationMs: Date.now() - start,
    totals,
    results,
  };
}
