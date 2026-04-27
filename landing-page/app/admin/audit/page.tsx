import { listAuditLog } from "@/lib/audit";
import AuditTable from "@/components/admin/AuditTable";

export const metadata = {
  title: "Audit log · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const rows = await listAuditLog(500);

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Audit log.</h1>
          <div className="tz-topbar-sub">
            Chronological record of privileged actions. Latest {rows.length} rows.
          </div>
        </div>
      </div>

      <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
        <AuditTable rows={rows} />
      </div>
    </>
  );
}
