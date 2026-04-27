import { Skeleton, SkeletonKpi, SkeletonTable } from "@/components/ui/Skeleton";

export default function ErrorsLoading() {
  return (
    <>
      <div className="tz-topbar">
        <div>
          <Skeleton width={100} height={22} />
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
        <SkeletonTable rows={8} columns={5} />
      </div>
    </>
  );
}
