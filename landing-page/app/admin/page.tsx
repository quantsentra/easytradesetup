import Link from "next/link";
import { listAllUsers } from "@/lib/auth-server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { OFFER_USD, OFFER_INR, format, USD_SET } from "@/lib/pricing";
import Sparkline from "@/components/admin/Sparkline";

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

type PageviewRow = { visitor_id: string; path: string; country: string | null; at: string };

function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const A = 0x1f1e6;
  const a = "A".charCodeAt(0);
  return String.fromCodePoint(A + code.charCodeAt(0) - a, A + code.charCodeAt(1) - a);
}

const COUNTRY_NAMES: Record<string, string> = {
  IN: "India", US: "United States", GB: "United Kingdom", AE: "UAE",
  SG: "Singapore", AU: "Australia", CA: "Canada", DE: "Germany",
  FR: "France", JP: "Japan", BR: "Brazil", PK: "Pakistan",
  BD: "Bangladesh", LK: "Sri Lanka", NP: "Nepal", PH: "Philippines",
  ID: "Indonesia", MY: "Malaysia", TH: "Thailand", VN: "Vietnam",
  NL: "Netherlands", IT: "Italy", ES: "Spain", PL: "Poland",
  TR: "Turkey", SA: "Saudi Arabia", ZA: "South Africa", NG: "Nigeria",
  EG: "Egypt", MX: "Mexico", AR: "Argentina", CN: "China",
  HK: "Hong Kong", KR: "South Korea", TW: "Taiwan", IE: "Ireland",
  CH: "Switzerland", SE: "Sweden", NO: "Norway", DK: "Denmark",
  FI: "Finland", BE: "Belgium", AT: "Austria", IL: "Israel",
};
function countryName(code: string): string {
  if (code === "??") return "Unknown";
  return COUNTRY_NAMES[code] || code;
}

async function loadOverview() {
  const users = await listAllUsers(500);

  let entitlements: EntRow[] = [];
  let openTickets = 0;
  let downloads = 0;
  let pageviews: PageviewRow[] = [];
  try {
    const supa = createSupabaseAdmin();
    const since30 = new Date(Date.now() - 30 * 24 * 3600e3).toISOString();
    const [ent, tk, dl, pv] = await Promise.all([
      supa.from("entitlements").select("user_id,active,granted_at,source"),
      supa.from("tickets").select("id", { count: "exact", head: true }).in("status", ["open", "waiting"]),
      supa.from("downloads").select("id", { count: "exact", head: true }),
      supa.from("pageviews").select("visitor_id,path,country,at").gte("at", since30),
    ]);
    entitlements = (ent.data as EntRow[]) || [];
    openTickets = tk.count ?? 0;
    downloads = dl.count ?? 0;
    pageviews = (pv.data as PageviewRow[]) || [];
  } catch {
    // service-role missing or pageviews table not migrated yet — degrade silently.
  }

  // Treat any non-refund entitlement as a "purchase order"
  const orders = entitlements.filter((e) => e.source !== "refund");
  const india = orders.filter((e) => e.source === "razorpay");
  const global = orders.filter((e) => e.source === "stripe");
  const paid = [...india, ...global];
  const manual = orders.filter((e) => e.source === "manual");
  const activeCount = orders.filter((e) => e.active).length;

  // Revenue: paid orders × launch price. Manual grants excluded.
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

  // Pageview aggregates
  const pvToday = pageviews.filter((p) => inRange(p.at, "today"));
  const pvWeek = pageviews.filter((p) => inRange(p.at, "week"));
  const pvMonth = pageviews;

  const uniquesToday = new Set(pvToday.map((p) => p.visitor_id)).size;
  const uniquesWeek = new Set(pvWeek.map((p) => p.visitor_id)).size;
  const uniquesMonth = new Set(pvMonth.map((p) => p.visitor_id)).size;

  // Top 5 paths in last 7 days
  const pathCounts = new Map<string, number>();
  for (const p of pvWeek) {
    pathCounts.set(p.path, (pathCounts.get(p.path) || 0) + 1);
  }
  const topPaths = [...pathCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, count]) => ({ path, count }));

  // Top 10 countries in last 30 days — unique visitors per country
  const countryVisitors = new Map<string, Set<string>>();
  for (const p of pvMonth) {
    const cc = (p.country || "").toUpperCase() || "??";
    if (!countryVisitors.has(cc)) countryVisitors.set(cc, new Set());
    countryVisitors.get(cc)!.add(p.visitor_id);
  }
  const topCountries = [...countryVisitors.entries()]
    .map(([code, set]) => ({ code, count: set.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const totalCountryUniques = topCountries.reduce((sum, c) => sum + c.count, 0);

  // 14-day visitor sparkline (uniques per day)
  const visitorDays: number[] = Array(14).fill(0);
  const now = Date.now();
  const visitorsByDay: Map<number, Set<string>> = new Map();
  for (let i = 0; i < 14; i++) visitorsByDay.set(i, new Set());
  for (const p of pageviews) {
    const ageDays = Math.floor((now - Date.parse(p.at)) / (24 * 3600e3));
    if (ageDays >= 0 && ageDays < 14) {
      visitorsByDay.get(ageDays)!.add(p.visitor_id);
    }
  }
  for (let i = 0; i < 14; i++) {
    visitorDays[13 - i] = visitorsByDay.get(i)!.size;
  }

  // 14-day revenue sparkline (paid orders × OFFER_USD per day)
  const revenueDays: number[] = Array(14).fill(0);
  for (const e of paid) {
    const ageDays = Math.floor((now - Date.parse(e.granted_at)) / (24 * 3600e3));
    if (ageDays >= 0 && ageDays < 14) {
      revenueDays[13 - ageDays] += OFFER_USD;
    }
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
    today: orders.filter((e) => inRange(e.granted_at, "today")).length,
    week: orders.filter((e) => inRange(e.granted_at, "week")).length,
    month: orders.filter((e) => inRange(e.granted_at, "month")).length,
    indiaWeek: india.filter((e) => inRange(e.granted_at, "week")).length,
    globalWeek: global.filter((e) => inRange(e.granted_at, "week")).length,
    signupsToday: users.filter((u) => inRange(u.createdAt, "today")).length,
    signupsWeek: users.filter((u) => inRange(u.createdAt, "week")).length,
    pvToday: pvToday.length,
    pvWeek: pvWeek.length,
    pvMonth: pvMonth.length,
    uniquesToday,
    uniquesWeek,
    uniquesMonth,
    topPaths,
    topCountries,
    totalCountryUniques,
    visitorDays,
    revenueDays,
  };
}

export default async function AdminOverview() {
  const d = await loadOverview();
  const conv = d.users.length > 0 ? Math.round((d.activeCount / d.users.length) * 100) : 0;

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Overview.</h1>
          <div className="tz-topbar-sub">
            {d.openTickets > 0
              ? `${d.openTickets} open ticket${d.openTickets === 1 ? "" : "s"} waiting · `
              : "Inbox clear · "}
            {d.signupsToday} new signup{d.signupsToday === 1 ? "" : "s"} today.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/checklist" className="tz-btn">MVP checklist</Link>
          <Link href="/admin/updates" className="tz-btn tz-btn-primary">Publish a note →</Link>
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
          <div className="flex items-start justify-between gap-2">
            <div style={{ minWidth: 0 }}>
              <div className="tz-kpi-label">Revenue · combined</div>
              <div className="tz-kpi-value tz-num" style={{ color: "var(--tz-acid-dim)" }}>
                {format(USD_SET, d.revenueUsd)}
              </div>
            </div>
            <Sparkline
              data={d.revenueDays}
              width={88}
              height={28}
              color="#2B7BFF"
              fillColor="rgba(43,123,255,0.16)"
              ariaLabel="14-day revenue trend"
            />
          </div>
          <div className="tz-kpi-delta">
            ≈ ₹{d.revenueInr.toLocaleString("en-IN")} · 14d
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
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

      {/* Traffic strip — anonymous pageviews */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="tz-kpi acc">
          <div className="flex items-start justify-between gap-2">
            <div style={{ minWidth: 0 }}>
              <div className="tz-kpi-label">Visitors · today</div>
              <div className="tz-kpi-value tz-num" style={{ fontSize: 22, color: "var(--tz-acid-dim)" }}>
                {d.uniquesToday}
              </div>
            </div>
            <Sparkline
              data={d.visitorDays}
              width={70}
              height={26}
              color="#22D3EE"
              fillColor="rgba(34,211,238,0.18)"
              ariaLabel="14-day visitor trend"
            />
          </div>
          <div className="tz-kpi-delta">{d.pvToday} pageviews · 14d</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Visitors · 7d</div>
          <div className="tz-kpi-value tz-num" style={{ fontSize: 22 }}>{d.uniquesWeek}</div>
          <div className="tz-kpi-delta">{d.pvWeek} pageviews</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Visitors · 30d</div>
          <div className="tz-kpi-value tz-num" style={{ fontSize: 22 }}>{d.uniquesMonth}</div>
          <div className="tz-kpi-delta">{d.pvMonth} pageviews</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Pages / visitor</div>
          <div className="tz-kpi-value tz-num" style={{ fontSize: 22 }}>
            {d.uniquesWeek > 0 ? (d.pvWeek / d.uniquesWeek).toFixed(1) : "—"}
          </div>
          <div className="tz-kpi-delta">7-day avg</div>
        </div>
      </div>

      {/* Top paths + countries 2-up */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
        {/* Top paths */}
        <div className="tz-card">
          <div className="tz-card-head">
            <div>
              <div className="tz-card-title">Top pages · 7d</div>
              <div className="tz-card-sub">Where visitors are landing.</div>
            </div>
          </div>
          {d.topPaths.length === 0 ? (
            <p className="text-[13.5px]" style={{ color: "var(--tz-ink-mute)" }}>
              No traffic logged yet — pageview tracking starts after deploy + first visits.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {d.topPaths.map((p) => {
                const pct = d.pvWeek > 0 ? Math.round((p.count / d.pvWeek) * 100) : 0;
                return (
                  <li key={p.path} className="flex items-center gap-3 py-2"
                    style={{ borderBottom: "1px solid var(--tz-border)" }}>
                    <span className="font-mono text-[12.5px] flex-1 truncate" style={{ color: "var(--tz-ink)" }}>
                      {p.path}
                    </span>
                    <div style={{
                      width: 80, height: 6, borderRadius: 3,
                      background: "var(--tz-surface-3)", overflow: "hidden", flexShrink: 0,
                    }}>
                      <div style={{
                        width: `${pct}%`, height: "100%",
                        background: "linear-gradient(90deg, var(--tz-acid), var(--tz-cyan))",
                      }} />
                    </div>
                    <span className="tz-num text-[12.5px]" style={{ color: "var(--tz-ink-dim)", minWidth: 56, textAlign: "right" }}>
                      {p.count} · {pct}%
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Top countries */}
        <div className="tz-card">
          <div className="tz-card-head">
            <div>
              <div className="tz-card-title">Top countries · 30d</div>
              <div className="tz-card-sub">Unique visitors by region.</div>
            </div>
          </div>
          {d.topCountries.length === 0 ? (
            <p className="text-[13.5px]" style={{ color: "var(--tz-ink-mute)" }}>
              No geo data yet — country resolves from edge IP on first marketing visit.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {d.topCountries.map((c) => {
                const pct = d.totalCountryUniques > 0
                  ? Math.round((c.count / d.totalCountryUniques) * 100)
                  : 0;
                return (
                  <li key={c.code} className="flex items-center gap-3 py-2"
                    style={{ borderBottom: "1px solid var(--tz-border)" }}>
                    <span style={{
                      width: 28, fontSize: 18,
                      flexShrink: 0, lineHeight: 1,
                    }} aria-hidden>
                      {flagEmoji(c.code)}
                    </span>
                    <span className="font-mono text-[12.5px]" style={{
                      width: 36, color: "var(--tz-ink)", flexShrink: 0,
                    }}>
                      {c.code}
                    </span>
                    <span className="text-[12.5px] flex-1 truncate" style={{ color: "var(--tz-ink-dim)" }}>
                      {countryName(c.code)}
                    </span>
                    <div style={{
                      width: 60, height: 6, borderRadius: 3,
                      background: "var(--tz-surface-3)", overflow: "hidden", flexShrink: 0,
                    }}>
                      <div style={{
                        width: `${pct}%`, height: "100%",
                        background: "linear-gradient(90deg, var(--tz-cyan), var(--tz-acid))",
                      }} />
                    </div>
                    <span className="tz-num text-[12.5px]" style={{ color: "var(--tz-ink-dim)", minWidth: 56, textAlign: "right" }}>
                      {c.count} · {pct}%
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
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
        Revenue estimate · paid orders × {format(USD_SET, OFFER_USD)} (launch price). Real per-order amounts come from Stripe metadata once webhooks fully populate.
      </p>
    </>
  );
}
