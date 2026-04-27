import { Skeleton, SkeletonKpi, SkeletonTable } from "@/components/ui/Skeleton";

export default function CustomersLoading() {
  return (
    <>
      <div className="tz-topbar">
        <div>
          <Skeleton width={150} height={22} />
          <div style={{ marginTop: 8 }}>
            <Skeleton width={280} height={11} />
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
            <Skeleton width={120} height={14} />
            <div style={{ marginTop: 6 }}>
              <Skeleton width={260} height={10} />
            </div>
          </div>
        </div>
        <SkeletonTable rows={6} columns={6} />
      </div>

      <div className="tz-card mt-6" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{
          padding: "16px 18px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div>
            <Skeleton width={170} height={14} />
            <div style={{ marginTop: 6 }}>
              <Skeleton width={310} height={10} />
            </div>
          </div>
        </div>
        <SkeletonTable rows={4} columns={6} />
      </div>
    </>
  );
}
