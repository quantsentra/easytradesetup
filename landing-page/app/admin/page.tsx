import Link from "next/link";
import { listAllUsers } from "@/lib/auth-server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { OFFER_USD, OFFER_INR, format, USD_SET } from "@/lib/pricing";

type EntRow = {
  user_id: string;
  active: boolean;
  granted_at: string;
  source: string;
};

type Range = "today" | "week" | "month";

function inRange(iso: string | null, range: Range): boolean {
  if (!iso) return false;
  const d = new Date(iso).getTime();
  const now = Date.now();
  const span =
    range === "today" ? 24 * 3600e3 :
    range === "week" ? 7 * 24 * 3600e3 :
    30 * 24 * 3600e3;
  return now - d <= span;
}

async function loadOverview() {
  const users = await listAllUsers(500);

  let entitlements: EntRow[] = [];
  let openTickets = 0;
  let downloads = 0;
  try {
    const supa = createSupabaseAdmin();
    const [ent, tk, dl] = await Promise.all([
      supa.from("entitlements").select("user_id,active,granted_at,source"),
      supa.from("tickets").select("id", { count: "exact", head: true }).in("status", ["open", "waiting"]),
      supa.from("downloads").select("id", { count: "exact", head: true }),
    ]);
    entitlements = (ent.data as EntRow[]) || [];
    openTickets = tk.count ?? 0;
    downloads = dl.count ?? 0;
  } catch {
    // service-role missing in dev — fall through with zeros
  }

  // Treat any non-refund entitlement as a "purchase order"
  const orders = entitlements.filter((e) => e.source !== "refund");
  const india = orders.filter((e) => e.source === "razorpay");
  const global = orders.filter((e) => e.source === "stripe");
  const paid = [...india, ...global];
  const manual = orders.filter((e) => e.source === "manual");
  const activeCount = orders.filter((e) => e.active).length;

  // Revenue: paid orders × inaugural offer. Manual grants excluded.
  const revenueUsd = paid.length * OFFER_USD;
  const revenueInr = paid.length * OFFER_INR;
  const indiaRevenueInr = india.length * OFFER_INR;
  const globalRevenueUsd = global.length * OFFER_USD;

  // Joins: customer email + name
  const usersById = new Map(users.map((u) => [u.id, u]));

  // Recent activity (last 10 orders by granted_at)
  const recent = [...orders]
    .sort((a, b) => Date.parse(b.granted_at) - Date.parse(a.granted_at))
    .slice(0, 10)
    .map((e) => ({
      ...e,
      email: usersById.get(e.user_id)?.email || "—",
      name: usersById.get(e.user_id)?.fullName || "",
    }));

  // 14-day signup sparkline
  const days: number[] = Array(14).fill(0);
  const now = Date.now();
  for (const u of users) {
    if (!u.createdAt) continue;
    const ageDays = Math.floor((now - Date.parse(u.createdAt)) / (24 * 3600e3));
    if (ageDays >= 0 && ageDays < 14) days[13 - ageDays] += 1;
  }

  return {
    users,
    activeCount,
    orders,
    india,
    global,
    paid,
    manual,
    revenueUsd,
    revenueInr,
    indiaRevenueInr,
    globalRevenueUsd,
    openTickets,
    downloads,
    recent,
    days,
    today: orders.filter((e) => inRange(e.granted_at, "today")).length,
    week: orders.filter((e) => inRange(e.granted_at, "week")).length,
    month: orders.filter((e) => inRange(e.granted_at, "month")).length,
    indiaWeek: india.filter((e) => inRange(e.granted_at, "week")).length,
    globalWeek: global.filter((e) => inRange(e.granted_at, "week")).length,
    signupsToday: users.filter((u) => inRange(u.createdAt, "today")).length,
    signupsWeek: users.filter((u) => inRange(u.createdAt, "week")).length,
  };
}

export default async function AdminOverview() {
  const d = await loadOverview();
  const conv = d.users.length > 0 ? Math.round((d.activeCount / d.users.length) * 100) : 0;
  const maxDay = Math.max(1, ...d.days);

  return (
    <>
      {/* Welcome hero */}
      <div className="tz-hero-card mb-6">
        <div className="tz-hero-grid">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.16em]" style={{ color: "var(--tz-ink-mute)" }}>
              Overview · Founder console
            </div>
            <h1 className="tz-hero-title">Welcome back, founder.</h1>
            <p className="tz-hero-sub">
              {d.openTickets > 0
                ? `${d.openTickets} open ticket${d.openTickets === 1 ? "" : "s"} waiting · `
                : "Inbox clear · "}
              {d.signupsToday} new signup{d.signupsToday === 1 ? "" : "s"} today.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/admin/customers" className="tz-btn tz-btn-primary">View customers →</Link>
              <Link href="/admin/tickets" className="tz-btn">Inbox</Link>
              <Link href="/admin/updates" className="tz-btn">Publish note</Link>
            </div>
          </div>
          <div className="tz-hero-vis">
            <div className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--tz-ink-mute)" }}>
              Signups · last 14 days
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
              {d.days.map((v, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${(v / maxDay) * 100}%`,
                    minHeight: 3,
                    borderRadius: 3,
                    background: v > 0
                      ? "linear-gradient(180deg, var(--tz-acid) 0%, var(--tz-cyan) 100%)"
                      : "var(--tz-surface-3)",
                    opacity: v > 0 ? 1 : 0.6,
                  }}
                  title={`${v} signup${v === 1 ? "" : "s"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI strip — Tabler bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div className="tz-kpi acc">
          <div className="tz-kpi-label">Total users</div>
          <div className="tz-kpi-value tz-num">{d.users.length}</div>
          <div className="tz-kpi-delta">
            +{d.signupsWeek} this week · {conv}% converted
          </div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Purchases · total</div>
          <div className="tz-kpi-value tz-num">{d.orders.length}</div>
          <div className="tz-kpi-delta">
            {d.paid.length} paid · {d.manual.length} manual
          </div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Revenue · combined</div>
          <div className="tz-kpi-value tz-num" style={{ color: "var(--tz-acid-dim)" }}>
            {format(USD_SET, d.revenueUsd)}
          </div>
          <div className="tz-kpi-delta">
            ≈ ₹{d.revenueInr.toLocaleString("en-IN")} · @ {format(USD_SET, OFFER_USD)} offer
          </div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Active licenses</div>
          <div className="tz-kpi-value tz-num">{d.activeCount}</div>
          <div className="tz-kpi-delta">Currently entitled</div>
        </div>
      </div>

      {/* Geo split — India vs Global */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <div className="tz-kpi" style={{
          background: "linear-gradient(135deg, rgba(34,211,238,0.06) 0%, transparent 60%), var(--tz-surface)",
          borderColor: "rgba(34,211,238,0.22)",
        }}>
          <div className="flex items-center justify-between">
            <div className="tz-kpi-label" style={{ color: "var(--tz-cyan-dim)" }}>
              India · Razorpay
            </div>
            <span className="tz-chip tz-chip-cyan">IN</span>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <div className="tz-num" style={{ font: "700 28px var(--tz-display)", letterSpacing: "-0.02em" }}>
              {d.india.length}
            </div>
            <div className="tz-num text-[14px]" style={{ color: "var(--tz-ink-dim)" }}>
              ₹{d.indiaRevenueInr.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="tz-kpi-delta">
            +{d.indiaWeek} this week · ₹{OFFER_INR.toLocaleString("en-IN")} per order
          </div>
        </div>

        <div className="tz-kpi" style={{
          background: "linear-gradient(135deg, rgba(43,123,255,0.06) 0%, transparent 60%), var(--tz-surface)",
          borderColor: "rgba(43,123,255,0.22)",
        }}>
          <div className="flex items-center justify-between">
            <div className="tz-kpi-label" style={{ color: "var(--tz-acid-dim)" }}>
              Global · Stripe
            </div>
            <span className="tz-chip tz-chip-acid">USD</span>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <div className="tz-num" style={{ font: "700 28px var(--tz-display)", letterSpacing: "-0.02em" }}>
              {d.global.length}
            </div>
            <div className="tz-num text-[14px]" style={{ color: "var(--tz-ink-dim)" }}>
              {format(USD_SET, d.globalRevenueUsd)}
            </div>
          </div>
          <div className="tz-kpi-delta">
            +{d.globalWeek} this week · {format(USD_SET, OFFER_USD)} per order
          </div>
        </div>
      </div>

      {/* Secondary strip — windowed */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="tz-kpi">
          <div className="tz-kpi-label">Orders today</div>
          <div className="tz-kpi-value tz-num" style={{ fontSize: 22 }}>{d.today}</div>
          <div className="tz-kpi-delta">Last 24h</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Orders · 7d</div>
          <div className="tz-kpi-value tz-num" style={{ fontSize: 22 }}>{d.week}</div>
          <div className="tz-kpi-delta">Rolling week</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Orders · 30d</div>
          <div className="tz-kpi-value tz-num" style={{ fontSize: 22 }}>{d.month}</div>
          <div className="tz-kpi-delta">Rolling month</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Open tickets</div>
          <div className="tz-kpi-value tz-num"
            style={{ fontSize: 22, color: d.openTickets > 0 ? "var(--tz-amber)" : "var(--tz-ink)" }}>
            {d.openTickets}
          </div>
          <div className="tz-kpi-delta">{d.downloads} downloads all-time</div>
        </div>
      </div>

      {/* Recent purchases */}
      <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{ padding: "18px 20px", marginBottom: 0, borderBottom: "1px solid var(--tz-border)" }}>
          <div>
            <div className="tz-card-title">Recent purchases</div>
            <div className="tz-card-sub">Latest 10 entitlements granted.</div>
          </div>
          <Link href="/admin/customers" className="tz-section-link">All customers →</Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tz-table" style={{ minWidth: 800 }}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Region</th>
                <th>Source</th>
                <th>Amount</th>
                <th>License</th>
                <th>Granted</th>
              </tr>
            </thead>
            <tbody>
              {d.recent.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--tz-ink-mute)" }}>
                    No purchases yet — payments go live at launch.
                  </td>
                </tr>
              ) : (
                d.recent.map((r) => {
                  const region =
                    r.source === "razorpay" ? { label: "India", chip: "tz-chip-cyan", amount: `₹${OFFER_INR.toLocaleString("en-IN")}` } :
                    r.source === "stripe"   ? { label: "Global", chip: "tz-chip-acid", amount: format(USD_SET, OFFER_USD) } :
                    { label: "—", chip: "", amount: "—" };
                  return (
                    <tr key={`${r.user_id}-${r.granted_at}`}>
                      <td>
                        <div style={{ color: "var(--tz-ink)", fontWeight: 500 }}>{r.email}</div>
                        {r.name && (
                          <div className="text-[11.5px]" style={{ color: "var(--tz-ink-mute)", marginTop: 2 }}>
                            {r.name}
                          </div>
                        )}
                      </td>
                      <td>
                        {region.chip ? (
                          <span className={`tz-chip ${region.chip}`}>{region.label}</span>
                        ) : (
                          <span style={{ color: "var(--tz-ink-mute)" }}>—</span>
                        )}
                      </td>
                      <td>
                        <span className={`tz-chip ${
                          r.source === "stripe" ? "tz-chip-acid" :
                          r.source === "razorpay" ? "tz-chip-cyan" :
                          r.source === "manual" ? "tz-chip-amber" :
                          "tz-chip-loss"
                        }`}>
                          {r.source}
                        </span>
                      </td>
                      <td className="tz-num" style={{ fontSize: 12 }}>
                        {region.amount}
                      </td>
                      <td>
                        {r.active ? (
                          <span className="tz-chip tz-chip-acid">
                            <span className="tz-chip-dot" />
                            Active
                          </span>
                        ) : (
                          <span className="tz-chip">Revoked</span>
                        )}
                      </td>
                      <td className="tz-num" style={{ fontSize: 12 }}>
                        {new Date(r.granted_at).toISOString().slice(0, 10)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-[10.5px] font-mono uppercase tracking-widest"
        style={{ color: "var(--tz-ink-mute)" }}>
        Revenue estimate · paid orders × {format(USD_SET, OFFER_USD)} (inaugural offer). Real per-order amounts will land when Stripe/Razorpay webhook is wired.
      </p>
    </>
  );
}
