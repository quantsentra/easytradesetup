import { Skeleton, SkeletonKpi, SkeletonCard } from "@/components/ui/Skeleton";

// Default portal loading state — covers /portal, /portal/downloads,
// /portal/updates, /portal/support, /portal/docs, /portal/account.

export default function PortalLoading() {
  return (
    <>
      <div className="tz-topbar">
        <div>
          <Skeleton width={140} height={22} />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonCard titleWidth="45%" bodyLines={4} />
        <SkeletonCard titleWidth="55%" bodyLines={4} />
      </div>

      <div className="mt-6">
        <SkeletonCard titleWidth="35%" bodyLines={6} />
      </div>
    </>
  );
}
