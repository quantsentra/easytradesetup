import type { CSSProperties } from "react";

// Skeleton primitives — used by route-level loading.tsx files. Pure CSS
// shimmer (.ets-skel from globals.css) so no client JS needed; loading.tsx
// renders these as a server component while data resolves.

export function Skeleton({
  width = "100%",
  height = 12,
  rounded = 6,
  style,
}: {
  width?: number | string;
  height?: number | string;
  rounded?: number | string;
  style?: CSSProperties;
}) {
  return (
    <span
      className="ets-skel"
      aria-hidden
      style={{
        display: "inline-block",
        width,
        height,
        borderRadius: rounded,
        ...style,
      }}
    />
  );
}

export function SkeletonText({
  lines = 3,
  lastWidth = "60%",
  lineHeight = 12,
  gap = 8,
}: {
  lines?: number;
  lastWidth?: string | number;
  lineHeight?: number;
  gap?: number;
}) {
  return (
    <span aria-hidden style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? lastWidth : "100%"}
        />
      ))}
    </span>
  );
}

export function SkeletonRect({
  width = "100%",
  height = 60,
  rounded = 10,
  style,
}: {
  width?: number | string;
  height?: number | string;
  rounded?: number | string;
  style?: CSSProperties;
}) {
  return <Skeleton width={width} height={height} rounded={rounded} style={style} />;
}

// KPI block (4-up strip used across admin)
export function SkeletonKpi() {
  return (
    <div className="tz-kpi">
      <div className="tz-kpi-label">
        <Skeleton width={92} height={10} />
      </div>
      <div className="tz-kpi-value" style={{ marginTop: 6 }}>
        <Skeleton width={64} height={26} rounded={4} />
      </div>
    </div>
  );
}

// Table-shaped skeleton for admin DataTable placeholders.
export function SkeletonTable({
  rows = 6,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div style={{ padding: "0 0 8px" }}>
      {/* Toolbar row */}
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: "12px 14px",
          borderBottom: "1px solid var(--tz-border, rgba(0,0,0,0.08))",
          flexWrap: "wrap",
        }}
      >
        <Skeleton width={220} height={26} />
        <Skeleton width={70}  height={22} />
        <Skeleton width={70}  height={22} />
        <Skeleton width={70}  height={22} />
        <Skeleton width={90}  height={26} style={{ marginLeft: "auto" }} />
      </div>
      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: 16,
          padding: "12px 14px",
          borderBottom: "1px solid var(--tz-border, rgba(0,0,0,0.06))",
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`h-${i}`} height={10} width="65%" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={`r-${r}`}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: 16,
            padding: "14px",
            borderBottom: "1px solid var(--tz-border, rgba(0,0,0,0.04))",
          }}
        >
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton
              key={`c-${r}-${c}`}
              height={12}
              width={c === 0 ? "85%" : c === columns - 1 ? "55%" : "70%"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Card skeleton — generic placeholder for bigger blocks (audit, error
// detail, market notes, etc.).
export function SkeletonCard({
  titleWidth = "55%",
  bodyLines = 4,
  style,
}: {
  titleWidth?: string | number;
  bodyLines?: number;
  style?: CSSProperties;
}) {
  return (
    <div className="tz-card" style={style}>
      <Skeleton width={titleWidth} height={16} />
      <div style={{ marginTop: 12 }}>
        <SkeletonText lines={bodyLines} lineHeight={11} />
      </div>
    </div>
  );
}
