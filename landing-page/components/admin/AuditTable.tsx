"use client";

import DataTable, { type Column, type FilterChip } from "./DataTable";
import type { AuditRow } from "@/lib/audit";

const columns: Column<AuditRow>[] = [
  {
    id: "at",
    label: "At",
    accessor: (r) => Date.parse(r.at),
    minWidth: 150,
    render: (r) => (
      <span className="tz-num" style={{ fontSize: 11.5, color: "var(--tz-ink-dim)" }}>
        {new Date(r.at).toISOString().slice(0, 19).replace("T", " ")}
      </span>
    ),
  },
  {
    id: "actor",
    label: "Actor",
    accessor: (r) => r.actor_id,
    render: (r) => (
      <span className="font-mono" style={{ fontSize: 11.5, color: "var(--tz-ink-mute)" }}>
        {r.actor_id.length > 16 ? `${r.actor_id.slice(0, 16)}…` : r.actor_id}
      </span>
    ),
  },
  {
    id: "action",
    label: "Action",
    accessor: (r) => r.action,
    render: (r) => (
      <span className="font-mono text-[11.5px]" style={{ color: "var(--tz-acid-dim)" }}>
        {r.action}
      </span>
    ),
  },
  {
    id: "target",
    label: "Target",
    accessor: (r) => `${r.target_kind || ""} ${r.target_id || ""}`,
    render: (r) =>
      r.target_kind ? (
        <span>
          <span style={{ color: "var(--tz-ink-dim)" }}>{r.target_kind}</span>
          {r.target_id && (
            <span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>
              {" · "}{r.target_id.length > 16 ? `${r.target_id.slice(0, 16)}…` : r.target_id}
            </span>
          )}
        </span>
      ) : (
        <span style={{ color: "var(--tz-ink-mute)" }}>—</span>
      ),
  },
  {
    id: "metadata",
    label: "Metadata",
    accessor: (r) => JSON.stringify(r.metadata),
    sortable: false,
    render: (r) => (
      <pre
        className="font-mono whitespace-pre-wrap"
        style={{ fontSize: 11, color: "var(--tz-ink-mute)", maxWidth: 360, margin: 0 }}
      >
        {JSON.stringify(r.metadata, null, 0)}
      </pre>
    ),
  },
];

// Filter chips are derived from the actual rows so we don't pin them
// to a frozen list of actions; the live set surfaces what's happening.
function deriveActionChips(rows: AuditRow[]): FilterChip<AuditRow>[] {
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(r.action, (counts.get(r.action) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([action, count]) => ({
      id: `action:${action}`,
      label: `${action} · ${count}`,
      predicate: (r) => r.action === action,
      color: "var(--tz-acid-dim)",
    }));
}

export default function AuditTable({ rows }: { rows: AuditRow[] }) {
  return (
    <DataTable<AuditRow>
      columns={columns}
      rows={rows}
      rowKey={(r) => String(r.id)}
      searchableAccessors={[
        (r) => r.action,
        (r) => r.actor_id,
        (r) => r.target_id,
        (r) => r.target_kind,
        (r) => JSON.stringify(r.metadata),
      ]}
      searchPlaceholder="Search action / actor / target / metadata…"
      defaultSort={{ columnId: "at", dir: "desc" }}
      pageSize={50}
      filterChips={deriveActionChips(rows)}
      exportFilename="audit-log"
      emptyMessage="No audit entries yet."
    />
  );
}
