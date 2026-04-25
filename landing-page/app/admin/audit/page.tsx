import { listAuditLog } from "@/lib/audit";

export default async function AdminAuditPage() {
  const rows = await listAuditLog(150);

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Audit log.</h1>
          <div className="tz-topbar-sub">
            Chronological record of privileged actions. Latest 150 rows.
          </div>
        </div>
      </div>

      <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="tz-table" style={{ minWidth: 720 }}>
            <thead>
              <tr>
                <th>At</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>Metadata</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--tz-ink-mute)" }}>
                    No audit entries yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td className="tz-num" style={{ fontSize: 11.5, color: "var(--tz-ink-dim)" }}>
                      {new Date(r.at).toISOString().slice(0, 19).replace("T", " ")}
                    </td>
                    <td className="font-mono" style={{ fontSize: 11.5, color: "var(--tz-ink-mute)" }}>
                      {r.actor_id.slice(0, 16)}…
                    </td>
                    <td>
                      <span className="font-mono text-[11.5px]" style={{ color: "var(--tz-acid-dim)" }}>
                        {r.action}
                      </span>
                    </td>
                    <td>
                      {r.target_kind ? (
                        <>
                          <span style={{ color: "var(--tz-ink-dim)" }}>{r.target_kind}</span>
                          {r.target_id && (
                            <span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>
                              {" · "}
                              {r.target_id.length > 16 ? `${r.target_id.slice(0, 16)}…` : r.target_id}
                            </span>
                          )}
                        </>
                      ) : (
                        <span style={{ color: "var(--tz-ink-faint)" }}>—</span>
                      )}
                    </td>
                    <td>
                      <pre className="font-mono whitespace-pre-wrap" style={{
                        fontSize: 11, color: "var(--tz-ink-mute)", maxWidth: 360, margin: 0,
                      }}>
                        {JSON.stringify(r.metadata, null, 0)}
                      </pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
