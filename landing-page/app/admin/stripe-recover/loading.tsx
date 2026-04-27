import { Skeleton, SkeletonTable } from "@/components/ui/Skeleton";

export default function StripeRecoverLoading() {
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

      {/* Manual replay card */}
      <div className="tz-card mb-6">
        <Skeleton width={130} height={14} />
        <div style={{ marginTop: 6 }}>
          <Skeleton width={320} height={10} />
        </div>
        <div style={{ marginTop: 14 }}>
          <Skeleton height={36} rounded={8} />
        </div>
      </div>

      <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{
          padding: "16px 18px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div>
            <Skeleton width={140} height={14} />
            <div style={{ marginTop: 6 }}>
              <Skeleton width={300} height={10} />
            </div>
          </div>
        </div>
        <SkeletonTable rows={5} columns={5} />
      </div>

      <div className="tz-card mt-6" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{
          padding: "16px 18px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div>
            <Skeleton width={170} height={14} />
            <div style={{ marginTop: 6 }}>
              <Skeleton width={320} height={10} />
            </div>
          </div>
        </div>
        <SkeletonTable rows={5} columns={7} />
      </div>
    </>
  );
}
