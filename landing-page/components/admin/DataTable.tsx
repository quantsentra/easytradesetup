"use client";

import { useMemo, useState, type ReactNode } from "react";

// Generic admin data table with built-in search, multi-column sort,
// filter chips, pagination, mobile card-list rendering, and CSV export.
//
// Server pages render the rows server-side then hand them to this client
// component for interactivity. Works fine up to a few thousand rows;
// switch to server-side pagination if any table grows past that.

export type Column<T> = {
  id: string;
  label: string;
  /** value used for sorting + CSV export */
  accessor: (row: T) => string | number | null;
  /** custom rendering for the table cell; falls back to the accessor */
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "right";
  /** min width in px on the wide-table view; helps prevent column squish */
  minWidth?: number;
  /** include only in CSV (e.g. raw IDs the table truncates) */
  csvOnly?: boolean;
};

export type FilterChip<T> = {
  id: string;
  label: string;
  predicate: (row: T) => boolean;
  /** chip color (defaults to neutral) */
  color?: string;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** array of accessors that participate in the search box; values lower-cased */
  searchableAccessors?: Array<(row: T) => string | null | undefined>;
  searchPlaceholder?: string;
  defaultSort?: { columnId: string; dir: "asc" | "desc" };
  pageSize?: number;
  pageSizeOptions?: number[];
  emptyMessage?: string;
  filterChips?: FilterChip<T>[];
  /** when set, surface an Export CSV button using this filename (without .csv) */
  exportFilename?: string;
  /** custom row rendering for the mobile card-list view; falls back to a simple list */
  mobileCard?: (row: T) => ReactNode;
  /** trailing actions column shown on every row (revoke, etc.) */
  rowActions?: (row: T) => ReactNode;
  /** stable footer note rendered below the pagination strip */
  footnote?: ReactNode;
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  searchableAccessors = [],
  searchPlaceholder = "Search…",
  defaultSort,
  pageSize = 25,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  emptyMessage = "No rows.",
  filterChips,
  exportFilename,
  mobileCard,
  rowActions,
  footnote,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [sortColumnId, setSortColumnId] = useState<string | null>(defaultSort?.columnId ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSort?.dir ?? "asc");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);

  const sortableColumns = useMemo(
    () => Object.fromEntries(columns.filter((c) => c.sortable !== false).map((c) => [c.id, c])),
    [columns],
  );

  // 1. Filter chips (any active chip → row must satisfy at least one)
  const afterChips = useMemo(() => {
    if (!filterChips || activeFilters.size === 0) return rows;
    const active = filterChips.filter((c) => activeFilters.has(c.id));
    return rows.filter((r) => active.some((c) => c.predicate(r)));
  }, [rows, filterChips, activeFilters]);

  // 2. Search (lowercased substring match across searchable accessors)
  const afterSearch = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || searchableAccessors.length === 0) return afterChips;
    return afterChips.filter((r) =>
      searchableAccessors.some((a) => {
        const v = a(r);
        return v != null && String(v).toLowerCase().includes(q);
      }),
    );
  }, [afterChips, query, searchableAccessors]);

  // 3. Sort (numeric vs string aware)
  const sorted = useMemo(() => {
    if (!sortColumnId) return afterSearch;
    const col = sortableColumns[sortColumnId];
    if (!col) return afterSearch;
    const dir = sortDir === "asc" ? 1 : -1;
    const copy = [...afterSearch];
    copy.sort((a, b) => {
      const av = col.accessor(a);
      const bv = col.accessor(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return copy;
  }, [afterSearch, sortColumnId, sortDir, sortableColumns]);

  // 4. Pagination clamp + slice
  const totalPages = Math.max(1, Math.ceil(sorted.length / size));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * size;
  const visible = sorted.slice(start, start + size);

  function toggleSort(colId: string) {
    if (sortColumnId === colId) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumnId(colId);
      setSortDir("asc");
    }
  }

  function toggleFilter(id: string) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setPage(1);
  }

  function exportCsv() {
    if (!exportFilename) return;
    const csvCols = columns;
    const header = csvCols.map((c) => csvEscape(c.label)).join(",");
    const lines = sorted.map((r) =>
      csvCols
        .map((c) => {
          const v = c.accessor(r);
          return csvEscape(v == null ? "" : String(v));
        })
        .join(","),
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFilename}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const visibleColumns = columns.filter((c) => !c.csvOnly);
  const showSearch = searchableAccessors.length > 0;
  const showFilters = filterChips && filterChips.length > 0;
  const showToolbar = showSearch || showFilters || exportFilename;

  return (
    <div>
      {showToolbar && (
        <div
          style={{
            display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center",
            padding: "12px 14px", borderBottom: "1px solid var(--tz-border)",
            background: "var(--tz-surface-2, transparent)",
          }}
        >
          {showSearch && (
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="tz-input"
              style={{
                flex: "1 1 200px", minWidth: 0, height: 32, padding: "0 10px",
                fontSize: 12.5, border: "1px solid var(--tz-border)",
                background: "var(--tz-surface)", color: "var(--tz-ink)", borderRadius: 6,
              }}
            />
          )}
          {showFilters && filterChips!.map((c) => {
            const active = activeFilters.has(c.id);
            const color = c.color || "var(--tz-ink-dim)";
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleFilter(c.id)}
                className="tz-chip"
                style={{
                  background: active ? color : "transparent",
                  color: active ? "#fff" : color,
                  borderColor: color,
                  cursor: "pointer",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  fontSize: 11.5,
                }}
              >
                {c.label}
              </button>
            );
          })}
          {exportFilename && (
            <button
              type="button"
              onClick={exportCsv}
              className="tz-btn"
              style={{ height: 32, padding: "0 12px", fontSize: 12, marginLeft: "auto" }}
            >
              Export CSV
            </button>
          )}
        </div>
      )}

      {/* Wide table — desktop / tablet */}
      <div className="hidden sm:block" style={{ overflowX: "auto" }}>
        <table className="tz-table" style={{ minWidth: 640 }}>
          <thead>
            <tr>
              {visibleColumns.map((c) => {
                const sortable = c.sortable !== false;
                const isSorted = sortColumnId === c.id;
                return (
                  <th
                    key={c.id}
                    style={{
                      cursor: sortable ? "pointer" : "default",
                      minWidth: c.minWidth || undefined,
                      textAlign: c.align === "right" ? "right" : "left",
                      userSelect: "none",
                    }}
                    onClick={sortable ? () => toggleSort(c.id) : undefined}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {c.label}
                      {sortable && (
                        <span style={{ opacity: isSorted ? 1 : 0.25, fontSize: 10 }}>
                          {isSorted ? (sortDir === "asc" ? "▲" : "▼") : "▲"}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
              {rowActions && <th aria-label="actions" />}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (rowActions ? 1 : 0)}
                  style={{ textAlign: "center", padding: 28, color: "var(--tz-ink-mute)" }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr key={rowKey(row)}>
                  {visibleColumns.map((c) => (
                    <td
                      key={c.id}
                      style={{ textAlign: c.align === "right" ? "right" : "left" }}
                    >
                      {c.render ? c.render(row) : String(c.accessor(row) ?? "")}
                    </td>
                  ))}
                  {rowActions && <td>{rowActions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="sm:hidden" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {visible.length === 0 ? (
          <li style={{ padding: 28, textAlign: "center", color: "var(--tz-ink-mute)", fontSize: 13 }}>
            {emptyMessage}
          </li>
        ) : (
          visible.map((row) => (
            <li
              key={rowKey(row)}
              style={{ borderBottom: "1px solid var(--tz-border)", padding: "12px 14px" }}
            >
              {mobileCard ? mobileCard(row) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {visibleColumns.map((c) => (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12.5 }}>
                      <span style={{ color: "var(--tz-ink-mute)", textTransform: "uppercase", fontSize: 10, letterSpacing: ".06em" }}>
                        {c.label}
                      </span>
                      <span style={{ color: "var(--tz-ink)", textAlign: "right", minWidth: 0, overflowWrap: "anywhere" }}>
                        {c.render ? c.render(row) : String(c.accessor(row) ?? "—")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {rowActions && <div style={{ marginTop: 8 }}>{rowActions(row)}</div>}
            </li>
          ))
        )}
      </ul>

      {/* Pagination */}
      {sorted.length > size && (
        <div
          style={{
            display: "flex", flexWrap: "wrap", justifyContent: "space-between",
            alignItems: "center", gap: 8, padding: "10px 14px",
            borderTop: "1px solid var(--tz-border)",
          }}
        >
          <span style={{ fontSize: 11.5, color: "var(--tz-ink-mute)", fontFamily: "var(--tz-mono, monospace)" }}>
            {start + 1}–{Math.min(start + size, sorted.length)} of {sorted.length}
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <select
              value={size}
              onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}
              className="tz-input"
              style={{
                height: 28, padding: "0 6px", fontSize: 11.5,
                border: "1px solid var(--tz-border)", background: "var(--tz-surface)",
                color: "var(--tz-ink)", borderRadius: 4,
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt} / page</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="tz-btn"
              style={{ height: 28, padding: "0 10px", fontSize: 11.5 }}
            >
              ← Prev
            </button>
            <span style={{ fontSize: 11.5, color: "var(--tz-ink-dim)", fontFamily: "var(--tz-mono, monospace)" }}>
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="tz-btn"
              style={{ height: 28, padding: "0 10px", fontSize: 11.5 }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {footnote && (
        <div style={{ padding: "10px 14px", fontSize: 10.5, fontFamily: "var(--tz-mono, monospace)", color: "var(--tz-ink-mute)", textTransform: "uppercase", letterSpacing: ".09em" }}>
          {footnote}
        </div>
      )}
    </div>
  );
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
