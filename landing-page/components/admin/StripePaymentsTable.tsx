"use client";

import DataTable, { type Column, type FilterChip } from "./DataTable";

export type PaymentRow = {
  id: string;
  email: string | null;
  amount: number;
  currency: string;
  created: number;
  status: string;
  hasCheckoutSession: boolean;
  cardBrand: string | null;
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

const columns: Column<PaymentRow>[] = [
  {
    id: "status",
    label: "Status",
    accessor: (r) => r.status,
    render: () => (
      <span className="tz-chip tz-chip-acid"><span className="tz-chip-dot" />Succeeded</span>
    ),
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
    id: "method",
    label: "Method",
    accessor: (r) => r.cardBrand || "",
    render: (r) => (
      <span className="text-[12.5px]" style={{ color: "var(--tz-ink-dim)", textTransform: "capitalize" }}>
        {r.cardBrand || "—"}
      </span>
    ),
  },
  {
    id: "source",
    label: "Source",
    accessor: (r) => (r.hasCheckoutSession ? "Checkout" : "Other"),
    render: (r) =>
      r.hasCheckoutSession ? (
        <span className="tz-chip tz-chip-cyan">Checkout</span>
      ) : (
        <span className="tz-chip">Other</span>
      ),
  },
  {
    id: "id",
    label: "Payment ID",
    accessor: (r) => r.id,
    render: (r) => (
      <span className="font-mono text-[11px]" style={{ color: "var(--tz-acid-dim)" }}>
        {r.id.length > 26 ? r.id.slice(0, 22) + "…" : r.id}
      </span>
    ),
  },
  {
    id: "created",
    label: "Date",
    accessor: (r) => r.created,
    render: (r) => relTime(r.created),
  },
];

const filterChips: FilterChip<PaymentRow>[] = [
  { id: "checkout", label: "Checkout",     predicate: (r) => r.hasCheckoutSession,   color: "var(--tz-cyan)" },
  { id: "other",    label: "Other source", predicate: (r) => !r.hasCheckoutSession,  color: "var(--tz-ink-mute)" },
  { id: "usd",      label: "USD",          predicate: (r) => r.currency === "usd",   color: "var(--tz-acid)" },
  { id: "inr",      label: "INR",          predicate: (r) => r.currency === "inr",   color: "var(--tz-cyan)" },
];

export default function StripePaymentsTable({ rows }: { rows: PaymentRow[] }) {
  return (
    <DataTable<PaymentRow>
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      searchableAccessors={[(r) => r.email, (r) => r.id, (r) => r.cardBrand]}
      searchPlaceholder="Search email / payment ID / card…"
      defaultSort={{ columnId: "created", dir: "desc" }}
      pageSize={25}
      filterChips={filterChips}
      exportFilename="stripe-payments"
      emptyMessage="No payments yet."
    />
  );
}
