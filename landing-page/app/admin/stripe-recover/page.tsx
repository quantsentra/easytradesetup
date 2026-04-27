import Link from "next/link";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import StripeRecoverButton from "@/components/admin/StripeRecoverButton";
import StripeSessionsTable, { type SessionRow as TblSessionRow } from "@/components/admin/StripeSessionsTable";
import StripePaymentsTable, { type PaymentRow as TblPaymentRow } from "@/components/admin/StripePaymentsTable";

export const metadata = {
  title: "Stripe recovery · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SessionRow = {
  id: string;
  paymentStatus: string;
  email: string | null;
  amount: number;
  currency: string;
  created: number;
  granted: boolean;
};

type PaymentRow = {
  id: string;
  email: string | null;
  amount: number;
  currency: string;
  created: number;
  status: string;
  hasCheckoutSession: boolean;
  cardBrand: string | null;
};

async function loadRecentSessions(): Promise<{ rows: SessionRow[]; configured: boolean }> {
  if (!stripeConfigured()) return { rows: [], configured: false };
  const stripe = getStripe();

  // Pull recent paid sessions. Cross-reference with the entitlements
  // table to flag which ones are already granted. Page size is large
  // enough to give the client-side table several pages of data without
  // hitting Stripe more than once per render.
  const sessions = await stripe.checkout.sessions.list({ limit: 100 });

  const sessionIds = sessions.data
    .map((s) => s.id)
    .filter(Boolean);

  let granted = new Set<string>();
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa
      .from("entitlements")
      .select("stripe_session_id")
      .in("stripe_session_id", sessionIds);
    granted = new Set((data || []).map((r: { stripe_session_id: string }) => r.stripe_session_id));
  } catch {
    // Service-role missing or migration not run — treat all as ungranted.
  }

  const rows: SessionRow[] = sessions.data
    .filter((s) => s.payment_status === "paid")
    .map((s) => ({
      id: s.id,
      paymentStatus: s.payment_status,
      email: s.customer_details?.email || s.customer_email || null,
      amount: (s.amount_total || 0) / 100,
      currency: (s.currency || "usd").toLowerCase(),
      created: s.created,
      granted: granted.has(s.id),
    }));

  return { rows, configured: true };
}

// Mirror Stripe's "Payments → All transactions" view so the operator sees
// the full picture — Checkout Sessions, Payment Links, invoices, manual
// payments — in one place. Only Checkout Sessions can be replayed via this
// tool; Payment Links / manual ones are shown for visibility only.
async function loadRecentPayments(): Promise<PaymentRow[]> {
  if (!stripeConfigured()) return [];
  const stripe = getStripe();
  const intents = await stripe.paymentIntents.list({ limit: 100 });

  // Build a quick set of payment_intent IDs that came from Checkout
  // Sessions so we can mark the rest as "Other (Payment Link / Manual)".
  const fromCheckout = new Set<string>();
  try {
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    for (const s of sessions.data) {
      if (s.payment_intent) {
        const pi = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent.id;
        fromCheckout.add(pi);
      }
    }
  } catch {
    // Falls through; everything will display as "?" provenance
  }

  return intents.data.map((p) => {
    const charge = p.latest_charge && typeof p.latest_charge !== "string" ? p.latest_charge : null;
    return {
      id: p.id,
      email:
        charge?.billing_details?.email ||
        p.receipt_email ||
        null,
      amount: (p.amount_received || p.amount || 0) / 100,
      currency: (p.currency || "usd").toLowerCase(),
      created: p.created,
      status: p.status,
      hasCheckoutSession: fromCheckout.has(p.id),
      cardBrand:
        charge?.payment_method_details?.card?.brand ||
        charge?.payment_method_details?.type ||
        null,
    };
  });
}

export default async function StripeRecoverPage() {
  const [{ rows, configured }, payments] = await Promise.all([
    loadRecentSessions(),
    loadRecentPayments(),
  ]);
  const ungranted = rows.filter((r) => !r.granted);
  const succeededPayments = payments.filter((p) => p.status === "succeeded");

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Stripe recovery.</h1>
          <div className="tz-topbar-sub">
            {configured
              ? `${ungranted.length} paid session${ungranted.length === 1 ? "" : "s"} need${ungranted.length === 1 ? "s" : ""} fulfilment`
              : "STRIPE_SECRET_KEY not set in Vercel env"}
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin" className="tz-btn tz-btn-primary">← Overview</Link>
        </div>
      </div>

      {!configured && (
        <div className="tz-card mb-6" style={{
          borderColor: "rgba(180,114,22,0.35)",
          background: "linear-gradient(135deg, rgba(180,114,22,0.05) 0%, transparent 60%), var(--tz-surface)",
        }}>
          <h2 style={{ font: "600 16px var(--tz-display)", color: "var(--tz-amber)", margin: "0 0 6px" }}>
            Stripe not configured
          </h2>
          <p className="text-[13.5px]" style={{ color: "var(--tz-ink-dim)" }}>
            Set <code>STRIPE_SECRET_KEY</code> in Vercel env vars and redeploy.
          </p>
        </div>
      )}

      {/* Manual recovery box — paste any cs_* id to replay */}
      <div className="tz-card mb-6">
        <div className="tz-card-head">
          <div>
            <div className="tz-card-title">Manual replay</div>
            <div className="tz-card-sub">Paste a Stripe Checkout Session ID (cs_live_… or cs_test_…) to re-run fulfilment.</div>
          </div>
        </div>
        <StripeRecoverButton />
      </div>

      {/* Auto-detected list of paid sessions — search / filter / paginate */}
      <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{
          padding: "16px 18px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div style={{ minWidth: 0 }}>
            <div className="tz-card-title">Paid sessions</div>
            <div className="tz-card-sub">
              ✓ = entitlement already granted in Supabase. ⚠ = needs replay.
            </div>
          </div>
        </div>
        <StripeSessionsTable rows={rows as TblSessionRow[]} />
      </div>

      {/* Full Payment Intents view — mirrors Stripe Dashboard Payments tab */}
      <div className="tz-card mt-6" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{
          padding: "16px 18px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div style={{ minWidth: 0 }}>
            <div className="tz-card-title">All Stripe payments</div>
            <div className="tz-card-sub">
              Mirror of Stripe Dashboard → Payments. Replay only works for Checkout-Session payments
              (the rest came from Payment Links, invoices, or the dashboard).
            </div>
          </div>
        </div>
        <StripePaymentsTable rows={succeededPayments as TblPaymentRow[]} />
      </div>

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest"
        style={{ color: "var(--tz-ink-mute)" }}>
        Replay is idempotent · already-granted sessions are skipped automatically.
      </p>
    </>
  );
}
