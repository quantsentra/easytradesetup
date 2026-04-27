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
  const { rows, configured } = await loadRecentSessions();
  const ungranted = rows.filter((r) => !r.granted);

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

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest"
        style={{ color: "var(--tz-ink-mute)" }}>
        Replay is idempotent · already-granted sessions are skipped automatically.
      </p>
    </>
  );
}
