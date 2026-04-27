import { Skeleton, SkeletonTable } from "@/components/ui/Skeleton";

export default function AuditLoading() {
  return (
    <>
      <div className="tz-topbar">
        <div>
          <Skeleton width={120} height={22} />
          <div style={{ marginTop: 8 }}>
            <Skeleton width={280} height={11} />
          </div>
        </div>
      </div>

      <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
        <SkeletonTable rows={10} columns={5} />
      </div>
    </>
  );
}
