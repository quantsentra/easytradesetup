import { Skeleton, SkeletonKpi, SkeletonTable } from "@/components/ui/Skeleton";

export default function QaRunLoading() {
  return (
    <>
      <div className="tz-topbar">
        <div>
          <Skeleton width={120} height={22} />
          <div style={{ marginTop: 8 }}>
            <Skeleton width={300} height={11} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
        <SkeletonKpi />
        <SkeletonKpi />
        <SkeletonKpi />
        <SkeletonKpi />
      </div>

      {/* Filter chips */}
      <div className="mb-5" style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "10px 0" }}>
        <Skeleton width={70} height={22} />
        <Skeleton width={90} height={22} />
        <Skeleton width={90} height={22} />
        <Skeleton width={70} height={22} />
      </div>

      {/* Per-category cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="tz-card mb-3" style={{ padding: 0, overflow: "hidden" }}>
          <div className="tz-card-head" style={{
            padding: "14px 16px", marginBottom: 0,
            borderBottom: "1px solid var(--tz-border)",
          }}>
            <div>
              <Skeleton width={120} height={14} />
              <div style={{ marginTop: 6 }}>
                <Skeleton width={220} height={10} />
              </div>
            </div>
          </div>
          <SkeletonTable rows={4} columns={4} />
        </div>
      ))}
    </>
  );
}
