import { Skeleton, SkeletonKpi, SkeletonTable } from "@/components/ui/Skeleton";

export default function QaLoading() {
  return (
    <>
      <div className="tz-topbar">
        <div>
          <Skeleton width={130} height={22} />
          <div style={{ marginTop: 8 }}>
            <Skeleton width={260} height={11} />
          </div>
        </div>
      </div>

      <div className="tz-card mb-5">
        <Skeleton width={150} height={14} />
        <div style={{ marginTop: 6 }}>
          <Skeleton width={280} height={10} />
        </div>
        <div style={{ marginTop: 14 }}>
          <Skeleton width={160} height={36} rounded={8} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
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
            <Skeleton width={150} height={14} />
            <div style={{ marginTop: 6 }}>
              <Skeleton width={220} height={10} />
            </div>
          </div>
        </div>
        <SkeletonTable rows={5} columns={6} />
      </div>
    </>
  );
}
