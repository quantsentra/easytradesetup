import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/server";

async function getCounts() {
  try {
    const supa = createSupabaseAdmin();
    const [ent, upd, dl, openTickets, allUsers] = await Promise.all([
      supa.from("entitlements").select("user_id", { count: "exact", head: true }).eq("active", true),
      supa.from("updates").select("id", { count: "exact", head: true }).eq("draft", false),
      supa.from("downloads").select("id", { count: "exact", head: true }),
      supa.from("tickets").select("id", { count: "exact", head: true }).in("status", ["open", "waiting"]),
      supa.from("user_activity").select("user_id", { count: "exact", head: true }),
    ]);
    return {
      active: ent.count ?? 0,
      updates: upd.count ?? 0,
      downloads: dl.count ?? 0,
      openTickets: openTickets.count ?? 0,
      activeUsers: allUsers.count ?? 0,
    };
  } catch {
    return { active: 0, updates: 0, downloads: 0, openTickets: 0, activeUsers: 0 };
  }
}

export default async function AdminOverview() {
  const c = await getCounts();

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Overview.</h1>
          <div className="tz-topbar-sub">
            Operational pulse — customers, tickets, and content shipping cadence.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/tickets" className="tz-btn">Inbox</Link>
          <Link href="/admin/updates" className="tz-btn tz-btn-primary">Publish a note →</Link>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="tz-kpi acc">
          <div className="tz-kpi-label">Active licenses</div>
          <div className="tz-kpi-value tz-num" style={{ color: "var(--tz-acid-dim)" }}>{c.active}</div>
          <div className="tz-kpi-delta">Entitlements · active = true</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Open tickets</div>
          <div className="tz-kpi-value tz-num"
            style={{ color: c.openTickets > 0 ? "var(--tz-amber)" : "var(--tz-ink)" }}>
            {c.openTickets}
          </div>
          <div className="tz-kpi-delta">Open + waiting</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Visitors tracked</div>
          <div className="tz-kpi-value tz-num">{c.activeUsers}</div>
          <div className="tz-kpi-delta">user_activity rows</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Published notes</div>
          <div className="tz-kpi-value tz-num">{c.updates}</div>
          <div className="tz-kpi-delta">Market notes · draft = false</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Downloads</div>
          <div className="tz-kpi-value tz-num">{c.downloads}</div>
          <div className="tz-kpi-delta">All time · audit log</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <ActionCard
          title="Support inbox"
          desc={c.openTickets > 0
            ? `${c.openTickets} ticket${c.openTickets === 1 ? "" : "s"} waiting for reply.`
            : "Inbox is clear. Reply within 24h to maintain SLA."}
          cta="Open inbox"
          href="/admin/tickets"
          accent={c.openTickets > 0}
        />
        <ActionCard
          title="Publish today's note"
          desc="Draft a pre-market bias and ship it to active customers."
          cta="New note"
          href="/admin/updates"
        />
        <ActionCard
          title="Audit log"
          desc="See who did what — admin replies, status changes, publishes."
          cta="View log"
          href="/admin/audit"
        />
      </div>

      <div className="tz-card mt-6">
        <div className="tz-card-head">
          <div>
            <div className="tz-card-title">Customers</div>
            <div className="tz-card-sub">Latest signups + license status.</div>
          </div>
          <Link href="/admin/customers" className="tz-btn">View all →</Link>
        </div>
        <p className="text-[14px]" style={{ color: "var(--tz-ink-dim)" }}>
          Switch to <Link href="/admin/customers" style={{ color: "var(--tz-acid-dim)" }}>Customers</Link>{" "}
          for the full Clerk × Supabase entitlement join — sortable, with active license rows pinned to top.
        </p>
      </div>
    </>
  );
}

function ActionCard({ title, desc, cta, href, accent }: {
  title: string;
  desc: string;
  cta: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link href={href} className="tz-card flex flex-col"
      style={{
        borderColor: accent ? "rgba(180,114,22,0.35)" : "var(--tz-border)",
        background: accent
          ? "linear-gradient(135deg, rgba(180,114,22,0.05) 0%, transparent 60%), var(--tz-surface)"
          : "var(--tz-surface)",
      }}>
      <h3 className="font-display font-semibold tracking-[-0.01em]"
        style={{ fontSize: 17, color: "var(--tz-ink)" }}>{title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed flex-1" style={{ color: "var(--tz-ink-dim)" }}>
        {desc}
      </p>
      <div className="mt-4 text-[13px] font-medium"
        style={{ color: accent ? "var(--tz-amber)" : "var(--tz-acid-dim)" }}>
        {cta} →
      </div>
    </Link>
  );
}
