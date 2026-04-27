import { Skeleton, SkeletonKpi } from "@/components/ui/Skeleton";

// Default admin loading state — Next.js renders this for any /admin/* route
// that doesn't supply its own loading.tsx. Mimics the topbar + 4-KPI
// strip + first card so the layout doesn't shift when data lands.

export default function AdminLoading() {
  return (
    <>
      <div className="tz-topbar">
        <div>
          <Skeleton width={170} height={22} />
          <div style={{ marginTop: 8 }}>
            <Skeleton width={260} height={11} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <SkeletonKpi />
        <SkeletonKpi />
        <SkeletonKpi />
        <SkeletonKpi />
      </div>

      <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{
          padding: "16px 18px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div>
            <Skeleton width={140} height={14} />
            <div style={{ marginTop: 6 }}>
              <Skeleton width={220} height={10} />
            </div>
          </div>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={28} />
          ))}
        </div>
      </div>
    </>
  );
}
