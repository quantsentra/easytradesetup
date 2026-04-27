import { Skeleton } from "@/components/ui/Skeleton";

// Default marketing loading state. Light-theme equivalent to the admin
// skeleton — page header + content blocks. Renders briefly while server
// components fetch (geo cookie, Supabase admin lookups on /checkout, etc.).

export default function MarketingLoading() {
  return (
    <>
      <section className="bg-surface">
        <div className="container-wide py-16">
          {/* Eyebrow + title */}
          <Skeleton width={160} height={11} />
          <div style={{ marginTop: 18 }}>
            <Skeleton width="78%" height={42} rounded={10} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Skeleton width="62%" height={42} rounded={10} />
          </div>
          {/* Lede */}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            <Skeleton width="92%" height={14} />
            <Skeleton width="88%" height={14} />
            <Skeleton width="55%" height={14} />
          </div>

          {/* Two-column content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                style={{
                  padding: 24,
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: "rgba(0,0,0,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <Skeleton width="40%" height={16} />
                <Skeleton width="100%" height={12} />
                <Skeleton width="92%"  height={12} />
                <Skeleton width="78%"  height={12} />
                <div style={{ marginTop: 12 }}>
                  <Skeleton width={140} height={36} rounded={8} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
