import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";

// Pre-launch readiness checklist. Each item either:
//   - has an `auto` function that determines status from env / DB / fetch
//   - is manual-only — operator ticks it via /api/admin/readiness/toggle
//
// Source of truth lives here. The /admin/readiness page renders this list
// joined against launch_readiness_acks (manual confirmations).

export type Severity = "blocker" | "warning";
export type Category = "Email" | "Database" | "Payments" | "Security" | "Operations" | "Content";

export type AutoStatus = {
  done: boolean;
  detail: string; // one-line observed value
};

export type ReadinessItem = {
  id: string;
  title: string;
  category: Category;
  severity: Severity;
  description: string;
  fixSteps: string[];
  /** if present, status is derived live; manual ack ignored */
  auto?: () => Promise<AutoStatus>;
};

// ---------- Auto-detect helpers --------------------------------------------

function envSet(...keys: string[]): boolean {
  return keys.some((k) => !!process.env[k]);
}

async function dbColumnExists(table: string, col: string): Promise<{ ok: boolean; msg: string }> {
  try {
    const supa = createSupabaseAdmin();
    const { error } = await supa.from(table).select(col).limit(1);
    if (error) return { ok: false, msg: error.message };
    return { ok: true, msg: `Column ${table}.${col} present` };
  } catch (e) {
    return { ok: false, msg: e instanceof Error ? e.message : String(e) };
  }
}

async function dbTableExists(table: string): Promise<{ ok: boolean; msg: string }> {
  try {
    const supa = createSupabaseAdmin();
    const { error, count } = await supa.from(table).select("*", { head: true, count: "exact" });
    if (error) return { ok: false, msg: error.message };
    return { ok: true, msg: `${count ?? 0} rows` };
  } catch (e) {
    return { ok: false, msg: e instanceof Error ? e.message : String(e) };
  }
}

// ---------- Items ---------------------------------------------------------

export const ITEMS: ReadinessItem[] = [
  // ------- BLOCKERS --------------------------------------------------------
  {
    id: "email.resend-key",
    title: "Resend API key set",
    category: "Email",
    severity: "blocker",
    description: "Without RESEND_API_KEY, no welcome / receipt / admin notification emails fire.",
    fixSteps: [
      "Resend → API Keys → Create",
      "Vercel → Settings → Environment Variables → add RESEND_API_KEY",
      "Redeploy",
    ],
    auto: async () => ({
      done: envSet("RESEND_API_KEY"),
      detail: envSet("RESEND_API_KEY") ? "RESEND_API_KEY set" : "RESEND_API_KEY missing",
    }),
  },
  {
    id: "email.purchase-from",
    title: "Verified sender email (not resend.dev sandbox)",
    category: "Email",
    severity: "blocker",
    description:
      "Sandbox sender (onboarding@resend.dev) lands welcome emails in spam ~40% of the time. Verify your domain in Resend so you can send from welcome@easytradesetup.com.",
    fixSteps: [
      "Resend → Domains → Add → easytradesetup.com",
      "Add DKIM, SPF, MX records to your DNS provider",
      "Wait for verification (~10 minutes)",
      "Vercel env: PURCHASE_FROM_EMAIL=welcome@easytradesetup.com",
      "Redeploy",
    ],
    auto: async () => {
      const v = (process.env.PURCHASE_FROM_EMAIL || "").trim();
      if (!v) return { done: false, detail: "PURCHASE_FROM_EMAIL not set — falling back to onboarding@resend.dev" };
      if (/resend\.dev/i.test(v)) return { done: false, detail: `Still sandbox: ${v}` };
      return { done: true, detail: v };
    },
  },
  {
    id: "payments.stripe-live-mode",
    title: "Stripe in LIVE mode",
    category: "Payments",
    severity: "blocker",
    description: "STRIPE_SECRET_KEY must start with sk_live_. Test keys (sk_test_) accept fake cards only.",
    fixSteps: [
      "Stripe Dashboard → toggle to Live mode",
      "Developers → API keys → reveal Live secret",
      "Vercel env: STRIPE_SECRET_KEY=sk_live_…",
      "Redeploy",
    ],
    auto: async () => {
      const k = process.env.STRIPE_SECRET_KEY || "";
      if (!k) return { done: false, detail: "STRIPE_SECRET_KEY missing" };
      if (k.startsWith("sk_live_")) return { done: true, detail: "sk_live_ prefix confirmed" };
      if (k.startsWith("sk_test_")) return { done: false, detail: "sk_test_ — still in test mode" };
      return { done: false, detail: `Unknown prefix: ${k.slice(0, 8)}…` };
    },
  },
  {
    id: "payments.stripe-webhook",
    title: "Stripe webhook secret set",
    category: "Payments",
    severity: "blocker",
    description: "Without STRIPE_WEBHOOK_SECRET, signature verification fails and no entitlement is granted automatically.",
    fixSteps: [
      "Stripe Dashboard → Developers → Webhooks → endpoint /api/webhook/stripe",
      "Reveal signing secret",
      "Vercel env: STRIPE_WEBHOOK_SECRET=whsec_…",
      "Redeploy",
    ],
    auto: async () => ({
      done: envSet("STRIPE_WEBHOOK_SECRET"),
      detail: envSet("STRIPE_WEBHOOK_SECRET") ? "Set" : "Missing",
    }),
  },
  {
    id: "db.019-stripe-columns",
    title: "Migration 019 applied (Stripe metadata columns)",
    category: "Database",
    severity: "blocker",
    description: "stripe_session_id / amount_cents / currency columns + stripe_events table — needed for idempotent fulfilment.",
    fixSteps: [
      "Supabase → SQL editor",
      "Paste contents of supabase/migrations/019_stripe.sql",
      "Run",
    ],
    auto: async () => {
      const r = await dbColumnExists("entitlements", "stripe_session_id");
      return { done: r.ok, detail: r.msg };
    },
  },
  {
    id: "db.020-qa-runs",
    title: "Migration 020 applied (qa_runs table)",
    category: "Database",
    severity: "blocker",
    description: "Required for /admin/qa to persist run history.",
    fixSteps: [
      "Supabase → SQL editor",
      "Paste contents of supabase/migrations/020_qa_runs.sql",
      "Run",
    ],
    auto: async () => {
      const r = await dbTableExists("qa_runs");
      return { done: r.ok, detail: r.ok ? `qa_runs OK (${r.msg})` : r.msg };
    },
  },
  {
    id: "db.021-soft-delete",
    title: "Migration 021 applied (soft-delete columns)",
    category: "Database",
    severity: "blocker",
    description: "revoked_at / revoked_by / revoke_reason — required for recoverable revoke flow.",
    fixSteps: [
      "Supabase → SQL editor",
      "Paste contents of supabase/migrations/021_soft_delete.sql",
      "Run",
    ],
    auto: async () => {
      const r = await dbColumnExists("entitlements", "revoked_at");
      return { done: r.ok, detail: r.msg };
    },
  },
  {
    id: "db.022-readiness",
    title: "Migration 022 applied (this checklist's ack table)",
    category: "Database",
    severity: "blocker",
    description: "Without this, manual checkmarks for non-auto-detectable items don't persist.",
    fixSteps: [
      "Supabase → SQL editor",
      "Paste contents of supabase/migrations/022_launch_readiness.sql",
      "Run",
    ],
    auto: async () => {
      const r = await dbTableExists("launch_readiness_acks");
      return { done: r.ok, detail: r.ok ? `launch_readiness_acks OK (${r.msg})` : r.msg };
    },
  },
  {
    id: "content.founder-bio",
    title: "Real founder bio + photo on /about",
    category: "Content",
    severity: "blocker",
    description: "Page currently shows placeholder TS — credibility hole. Replace with name, photo, LinkedIn, 2-paragraph story.",
    fixSteps: [
      "Edit app/(marketing)/about/page.tsx",
      "Add name, headshot URL (public/), LinkedIn link, story",
      "Tick this item once live",
    ],
  },

  // ------- WARNINGS --------------------------------------------------------
  {
    id: "security.admin-2fa",
    title: "Admin account has 2FA enabled",
    category: "Security",
    severity: "warning",
    description: "Single-factor admin = single point of failure. Supabase Auth supports TOTP.",
    fixSteps: [
      "Supabase → your project → Auth → Settings → enable MFA",
      "Re-sign-in to enrol your TOTP app",
      "Tick this item once enrolled",
    ],
  },
  {
    id: "security.csp-nonce",
    title: "CSP without unsafe-inline / unsafe-eval",
    category: "Security",
    severity: "warning",
    description: "Current CSP allows inline scripts to keep the FOUC theme-init script working. Migrate that script behind a nonce to tighten.",
    fixSteps: [
      "Move FOUC theme-init script to external file with nonce",
      "Drop 'unsafe-inline' / 'unsafe-eval' from script-src in next.config.mjs",
      "Tick this item once shipped",
    ],
  },
  {
    id: "ops.staging-environment",
    title: "Staging environment / preview gate",
    category: "Operations",
    severity: "warning",
    description: "Currently every push to main hits production. Add a staging branch + preview-only protected deploys.",
    fixSteps: [
      "Vercel → Project Settings → Git → only deploy main on manual promotion",
      "Or: branch off `staging`, deploy main only after staging green",
    ],
  },
  {
    id: "ops.ci-actions",
    title: "GitHub Actions CI gating PR merges",
    category: "Operations",
    severity: "warning",
    description: "npm test + npm run build should run on every PR before merge.",
    fixSteps: [
      "Add .github/workflows/ci.yml — pnpm install + test + build on Node 20",
      "Branch protection: require status check before merge to main",
    ],
  },
  {
    id: "payments.stripe-inr-tested",
    title: "Stripe INR live charge tested with real card",
    category: "Payments",
    severity: "warning",
    description: "Cross-border INR charging works for international Stripe accounts but should be confirmed before promoting INR pricing.",
    fixSteps: [
      "Open /checkout?ccy=inr from any browser",
      "Pay ₹4,599 with a real Indian card",
      "Verify webhook fires + entitlement granted + invoice email lands",
      "Tick this item once confirmed",
    ],
  },
  {
    id: "ops.backup-restore-drill",
    title: "Supabase backup restore drilled",
    category: "Operations",
    severity: "warning",
    description: "Pro plan auto-backs up daily. Restore has never been tested. Drill once before a real incident.",
    fixSteps: [
      "Supabase → your project → Database → Backups",
      "Restore the most recent daily into a fresh project (separate URL)",
      "Verify entitlements + auth.users land intact",
      "Document the restore URL + retention window in README",
      "Tick this item once drilled",
    ],
  },
  {
    id: "content.testimonials",
    title: "First 3 customer testimonials live (post-launch only)",
    category: "Content",
    severity: "warning",
    description: "Self-imposed gate — collect after first sales with written permission and verifiable purchase records.",
    fixSteps: [
      "Email first 10 buyers ~14 days post-purchase",
      "Ask permission for first-name + city + 2-line quote",
      "Add to home / sample / about pages",
      "Tick this item once 3 are live",
    ],
  },
  {
    id: "ops.sentry-alerting",
    title: "Sentry alert routes wired to email/Slack",
    category: "Operations",
    severity: "warning",
    description: "Errors hit Sentry but no automated notification fires unless an alert rule is configured.",
    fixSteps: [
      "Sentry → Alerts → create rule",
      "Trigger: any new issue in production",
      "Action: email or Slack to founder",
      "Tick this item once a test issue routes correctly",
    ],
  },
];

// Snapshot type returned to the page renderer.
export type ReadinessRow = ReadinessItem & {
  status: AutoStatus | null; // present only when item has an auto detector
  manualAcked: boolean;
  ackedAt: string | null;
  effectiveDone: boolean;
};

export async function loadReadiness(): Promise<ReadinessRow[]> {
  // Fetch acks in a single query so manual rows don't N+1.
  let acks = new Map<string, { acked_at: string }>();
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa
      .from("launch_readiness_acks")
      .select("slug, acked_at");
    for (const row of (data || []) as { slug: string; acked_at: string }[]) {
      acks.set(row.slug, { acked_at: row.acked_at });
    }
  } catch {
    acks = new Map(); // table may not exist yet — handled by db.022 item
  }

  const results = await Promise.all(
    ITEMS.map(async (item): Promise<ReadinessRow> => {
      const status = item.auto ? await item.auto() : null;
      const ack = acks.get(item.id);
      const manualAcked = !!ack;
      const effectiveDone = status ? status.done : manualAcked;
      return {
        ...item,
        status,
        manualAcked,
        ackedAt: ack?.acked_at || null,
        effectiveDone,
      };
    }),
  );

  return results;
}
