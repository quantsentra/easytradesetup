import Link from "next/link";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import StripeRecoverButton from "@/components/admin/StripeRecoverButton";

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

  // Pull the most recent 30 paid sessions. Cross-reference with the
  // entitlements table to flag which ones are already granted.
  const sessions = await stripe.checkout.sessions.list({ limit: 30 });

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
  const intents = await stripe.paymentIntents.list({ limit: 30 });

  // Build a quick set of payment_intent IDs that came from Checkout
  // Sessions so we can mark the rest as "Other (Payment Link / Manual)".
  const fromCheckout = new Set<string>();
  try {
    const sessions = await stripe.checkout.sessions.list({ limit: 30 });
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

function fmtMoney(amount: number, currency: string): string {
  if (currency === "usd") return `$${amount.toFixed(2)}`;
  if (currency === "inr") return `₹${amount.toLocaleString("en-IN")}`;
  return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
}

function relTime(unixSec: number): string {
  const sec = Date.now() / 1000 - unixSec;
  if (sec < 60) return `${Math.floor(sec)}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return new Date(unixSec * 1000).toISOString().slice(0, 10);
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

      {/* Auto-detected list of ungranted paid sessions */}
      <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{
          padding: "18px 20px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div>
            <div className="tz-card-title">Recent paid sessions · last 30</div>
            <div className="tz-card-sub">
              ✓ = entitlement already granted in Supabase. ⚠ = needs replay.
            </div>
          </div>
        </div>
        {rows.length === 0 ? (
          <p className="text-[13.5px] p-6" style={{ color: "var(--tz-ink-mute)" }}>
            No paid sessions in Stripe yet.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tz-table" style={{ minWidth: 760 }}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Buyer</th>
                  <th>Amount</th>
                  <th>Session ID</th>
                  <th>Paid</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.granted ? (
                        <span className="tz-chip tz-chip-acid">
                          <span className="tz-chip-dot" />
                          Granted
                        </span>
                      ) : (
                        <span className="tz-chip tz-chip-amber">⚠ Needs replay</span>
                      )}
                    </td>
                    <td style={{ color: "var(--tz-ink)" }}>
                      {r.email || <span style={{ color: "var(--tz-ink-mute)" }}>—</span>}
                    </td>
                    <td className="tz-num">{fmtMoney(r.amount, r.currency)}</td>
                    <td className="font-mono text-[11.5px]" style={{ color: "var(--tz-acid-dim)" }}>
                      {r.id.length > 28 ? r.id.slice(0, 24) + "…" : r.id}
                    </td>
                    <td className="tz-num text-[12px]" style={{ color: "var(--tz-ink-dim)" }}>
                      {relTime(r.created)}
                    </td>
                    <td>
                      {!r.granted && <StripeRecoverButton sessionId={r.id} compact />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Payment Intents view — mirrors Stripe Dashboard Payments tab */}
      <div className="tz-card mt-6" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{
          padding: "18px 20px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div>
            <div className="tz-card-title">All Stripe payments · last 30</div>
            <div className="tz-card-sub">
              Mirror of Stripe Dashboard → Payments. Replay only works for Checkout-Session payments
              (the rest came from Payment Links, invoices, or the dashboard).
            </div>
          </div>
        </div>
        {succeededPayments.length === 0 ? (
          <p className="text-[13.5px] p-6" style={{ color: "var(--tz-ink-mute)" }}>
            No payments yet.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tz-table" style={{ minWidth: 820 }}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Buyer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Source</th>
                  <th>Payment ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {succeededPayments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="tz-chip tz-chip-acid">
                        <span className="tz-chip-dot" />
                        Succeeded
                      </span>
                    </td>
                    <td style={{ color: "var(--tz-ink)" }}>
                      {p.email || <span style={{ color: "var(--tz-ink-mute)" }}>—</span>}
                    </td>
                    <td className="tz-num">{fmtMoney(p.amount, p.currency)}</td>
                    <td className="text-[12.5px]" style={{ color: "var(--tz-ink-dim)", textTransform: "capitalize" }}>
                      {p.cardBrand || "—"}
                    </td>
                    <td>
                      {p.hasCheckoutSession ? (
                        <span className="tz-chip tz-chip-cyan">Checkout</span>
                      ) : (
                        <span className="tz-chip">Other</span>
                      )}
                    </td>
                    <td className="font-mono text-[11.5px]" style={{ color: "var(--tz-acid-dim)" }}>
                      {p.id.length > 26 ? p.id.slice(0, 22) + "…" : p.id}
                    </td>
                    <td className="tz-num text-[12px]" style={{ color: "var(--tz-ink-dim)" }}>
                      {relTime(p.created)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest"
        style={{ color: "var(--tz-ink-mute)" }}>
        Replay is idempotent · already-granted sessions are skipped automatically.
      </p>
    </>
  );
}
