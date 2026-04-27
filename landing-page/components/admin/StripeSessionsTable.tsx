"use client";

import DataTable, { type Column, type FilterChip } from "./DataTable";
import StripeRecoverButton from "./StripeRecoverButton";

export type SessionRow = {
  id: string;
  paymentStatus: string;
  email: string | null;
  amount: number;
  currency: string;
  created: number; // unix seconds
  granted: boolean;
};

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

const columns: Column<SessionRow>[] = [
  {
    id: "granted",
    label: "Status",
    accessor: (r) => (r.granted ? 1 : 0),
    render: (r) =>
      r.granted ? (
        <span className="tz-chip tz-chip-acid"><span className="tz-chip-dot" />Granted</span>
      ) : (
        <span className="tz-chip tz-chip-amber">⚠ Needs replay</span>
      ),
    minWidth: 130,
  },
  {
    id: "email",
    label: "Buyer",
    accessor: (r) => r.email || "",
    minWidth: 200,
    render: (r) => r.email || <span style={{ color: "var(--tz-ink-mute)" }}>—</span>,
  },
  {
    id: "amount",
    label: "Amount",
    accessor: (r) => r.amount,
    render: (r) => <span className="tz-num">{fmtMoney(r.amount, r.currency)}</span>,
    align: "right",
  },
  {
    id: "id",
    label: "Session ID",
    accessor: (r) => r.id,
    render: (r) => (
      <span className="font-mono text-[11px]" style={{ color: "var(--tz-acid-dim)" }}>
        {r.id.length > 28 ? r.id.slice(0, 24) + "…" : r.id}
      </span>
    ),
  },
  {
    id: "created",
    label: "Paid",
    accessor: (r) => r.created,
    render: (r) => relTime(r.created),
  },
];

const filterChips: FilterChip<SessionRow>[] = [
  { id: "ungranted", label: "Needs replay", predicate: (r) => !r.granted, color: "var(--tz-amber)" },
  { id: "granted",   label: "Granted",      predicate: (r) => r.granted,  color: "var(--tz-win)" },
  { id: "usd",       label: "USD",          predicate: (r) => r.currency === "usd",  color: "var(--tz-acid)" },
  { id: "inr",       label: "INR",          predicate: (r) => r.currency === "inr",  color: "var(--tz-cyan)" },
];

export default function StripeSessionsTable({ rows }: { rows: SessionRow[] }) {
  return (
    <DataTable<SessionRow>
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      searchableAccessors={[(r) => r.email, (r) => r.id]}
      searchPlaceholder="Search by email or session ID…"
      defaultSort={{ columnId: "created", dir: "desc" }}
      pageSize={25}
      filterChips={filterChips}
      exportFilename="stripe-sessions"
      emptyMessage="No paid sessions in Stripe yet."
      rowActions={(r) => (!r.granted ? <StripeRecoverButton sessionId={r.id} compact /> : null)}
    />
  );
}
