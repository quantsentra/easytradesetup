"use client";

import DataTable, { type Column, type FilterChip } from "./DataTable";
import RevokeEntitlementButton from "./RevokeEntitlementButton";

export type CustomerRow = {
  userId: string;
  email: string;
  name: string;
  signedUpAt: string | null;
  active: boolean;
  grantedAt: string | null;
  source: string | null;
};

const columns: Column<CustomerRow>[] = [
  {
    id: "email",
    label: "Email",
    accessor: (r) => r.email || "",
    minWidth: 220,
    render: (r) => (
      <div>
        <div style={{ color: "var(--tz-ink)", fontWeight: 500 }}>{r.email || "—"}</div>
        <div className="font-mono" style={{ marginTop: 2, fontSize: 10.5, color: "var(--tz-ink-mute)" }}>
          {r.userId}
        </div>
      </div>
    ),
  },
  { id: "name", label: "Name", accessor: (r) => r.name || "" },
  {
    id: "signedUpAt",
    label: "Signed up",
    accessor: (r) => (r.signedUpAt ? Date.parse(r.signedUpAt) : 0),
    render: (r) => r.signedUpAt ? new Date(r.signedUpAt).toISOString().slice(0, 10) : "—",
  },
  {
    id: "active",
    label: "License",
    accessor: (r) => (r.active ? 1 : 0),
    render: (r) =>
      r.active ? (
        <span className="tz-chip tz-chip-acid"><span className="tz-chip-dot" />Active</span>
      ) : (
        <span className="tz-chip">No license</span>
      ),
  },
  {
    id: "grantedAt",
    label: "Granted",
    accessor: (r) => (r.grantedAt ? Date.parse(r.grantedAt) : 0),
    render: (r) => r.grantedAt ? new Date(r.grantedAt).toISOString().slice(0, 10) : "—",
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
];

const filterChips: FilterChip<CustomerRow>[] = [
  { id: "active",   label: "Active",   predicate: (r) => r.active,                      color: "var(--tz-win)" },
  { id: "inactive", label: "Inactive", predicate: (r) => !r.active,                     color: "var(--tz-ink-mute)" },
  { id: "stripe",   label: "Stripe",   predicate: (r) => r.source === "stripe",         color: "var(--tz-acid)" },
  { id: "razorpay", label: "Razorpay", predicate: (r) => r.source === "razorpay",       color: "var(--tz-cyan)" },
  { id: "manual",   label: "Manual",   predicate: (r) => r.source === "manual",         color: "var(--tz-amber)" },
];

export default function CustomerTable({ rows }: { rows: CustomerRow[] }) {
  return (
    <DataTable<CustomerRow>
      columns={columns}
      rows={rows}
      rowKey={(r) => r.userId}
      searchableAccessors={[(r) => r.email, (r) => r.name, (r) => r.userId]}
      searchPlaceholder="Search email / name / user_id…"
      defaultSort={{ columnId: "active", dir: "desc" }}
      pageSize={25}
      filterChips={filterChips}
      exportFilename="customers"
      emptyMessage="No users yet."
      rowActions={(r) =>
        r.active ? <RevokeEntitlementButton userId={r.userId} email={r.email} /> : null
      }
    />
  );
}
