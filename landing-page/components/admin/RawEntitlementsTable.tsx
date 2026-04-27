"use client";

import DataTable, { type Column, type FilterChip } from "./DataTable";
import RevokeEntitlementButton from "./RevokeEntitlementButton";

export type RawEntRow = {
  userId: string;
  email: string;
  active: boolean;
  grantedAt: string | null;
  source: string | null;
  amountCents: number | null;
  currency: string | null;
  stripeSessionId: string | null;
};

function fmtAmount(cents: number | null, currency: string | null): string {
  if (cents == null) return "—";
  const v = cents / 100;
  if ((currency || "").toLowerCase() === "inr") return `₹${v.toLocaleString("en-IN")}`;
  if ((currency || "").toLowerCase() === "usd") return `$${v.toFixed(2)}`;
  return `${v.toFixed(2)} ${(currency || "").toUpperCase()}`;
}

const columns: Column<RawEntRow>[] = [
  {
    id: "active",
    label: "Status",
    accessor: (r) => (r.active ? 1 : 0),
    render: (r) =>
      r.active ? (
        <span className="tz-chip tz-chip-acid"><span className="tz-chip-dot" />Active</span>
      ) : (
        <span className="tz-chip">Inactive</span>
      ),
    minWidth: 90,
  },
  {
    id: "email",
    label: "Email / user",
    accessor: (r) => r.email,
    minWidth: 220,
    render: (r) => {
      const isOrphan = r.email.startsWith("(orphan");
      return (
        <div>
          <div style={{ color: isOrphan ? "var(--tz-amber)" : "var(--tz-ink)", fontWeight: 500 }}>
            {r.email}
          </div>
          <div className="font-mono" style={{ marginTop: 2, fontSize: 10.5, color: "var(--tz-ink-mute)" }}>
            {r.userId}
          </div>
        </div>
      );
    },
  },
  {
    id: "source",
    label: "Source",
    accessor: (r) => r.source || "",
    render: (r) => (
      <span className="font-mono text-[11.5px]" style={{ color: "var(--tz-ink-mute)" }}>
        {r.source || "—"}
      </span>
    ),
  },
  {
    id: "amount",
    label: "Amount",
    accessor: (r) => r.amountCents ?? 0,
    render: (r) => <span className="tz-num">{fmtAmount(r.amountCents, r.currency)}</span>,
    align: "right",
  },
  {
    id: "session",
    label: "Stripe session",
    accessor: (r) => r.stripeSessionId || "",
    render: (r) => (
      <span className="font-mono text-[11px]" style={{ color: "var(--tz-acid-dim)" }}>
        {r.stripeSessionId
          ? r.stripeSessionId.length > 22
            ? r.stripeSessionId.slice(0, 18) + "…"
            : r.stripeSessionId
          : "—"}
      </span>
    ),
  },
  {
    id: "grantedAt",
    label: "Granted",
    accessor: (r) => (r.grantedAt ? Date.parse(r.grantedAt) : 0),
    render: (r) => r.grantedAt ? new Date(r.grantedAt).toISOString().slice(0, 10) : "—",
  },
];

const filterChips: FilterChip<RawEntRow>[] = [
  { id: "active",   label: "Active",   predicate: (r) => r.active,                          color: "var(--tz-win)" },
  { id: "inactive", label: "Inactive", predicate: (r) => !r.active,                         color: "var(--tz-ink-mute)" },
  { id: "orphan",   label: "Orphans",  predicate: (r) => r.email.startsWith("(orphan"),     color: "var(--tz-amber)" },
  { id: "stripe",   label: "Stripe",   predicate: (r) => r.source === "stripe",             color: "var(--tz-acid)" },
  { id: "razorpay", label: "Razorpay", predicate: (r) => r.source === "razorpay",           color: "var(--tz-cyan)" },
  { id: "manual",   label: "Manual",   predicate: (r) => r.source === "manual",             color: "var(--tz-amber)" },
];

export default function RawEntitlementsTable({ rows }: { rows: RawEntRow[] }) {
  return (
    <DataTable<RawEntRow>
      columns={columns}
      rows={rows}
      rowKey={(r) => `${r.userId}-${r.grantedAt || ""}`}
      searchableAccessors={[
        (r) => r.email,
        (r) => r.userId,
        (r) => r.stripeSessionId,
        (r) => r.source,
      ]}
      searchPlaceholder="Search email / user_id / session / source…"
      defaultSort={{ columnId: "grantedAt", dir: "desc" }}
      pageSize={25}
      filterChips={filterChips}
      exportFilename="entitlements"
      emptyMessage="No entitlement rows."
      rowActions={(r) => <RevokeEntitlementButton userId={r.userId} email={r.email} />}
    />
  );
}
