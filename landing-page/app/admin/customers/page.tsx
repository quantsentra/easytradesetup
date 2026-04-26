import { listAllUsers } from "@/lib/auth-server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

type Row = {
  userId: string;
  email: string;
  name: string;
  signedUpAt: string | null;
  active: boolean;
  grantedAt: string | null;
  source: string | null;
};

async function fetchRows(): Promise<Row[]> {
  const users = await listAllUsers(200);

  let entitlements: Array<{ user_id: string; active: boolean; granted_at: string; source: string }> = [];
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa.from("entitlements").select("user_id,active,granted_at,source");
    entitlements = data || [];
  } catch {
    entitlements = [];
  }
  const byUser = new Map(entitlements.map((e) => [e.user_id, e]));

  const rows: Row[] = users.map((u) => {
    const ent = byUser.get(u.id);
    return {
      userId: u.id,
      email: u.email || "",
      name: u.fullName || "",
      signedUpAt: u.createdAt,
      active: ent?.active === true,
      grantedAt: ent?.granted_at || null,
      source: ent?.source || null,
    };
  });

  rows.sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    const aTs = a.signedUpAt ? Date.parse(a.signedUpAt) : 0;
    const bTs = b.signedUpAt ? Date.parse(b.signedUpAt) : 0;
    return bTs - aTs;
  });

  return rows;
}

export default async function AdminCustomersPage() {
  const rows = await fetchRows();
  const activeCount = rows.filter((r) => r.active).length;

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Customers.</h1>
          <div className="tz-topbar-sub">
            {rows.length} users · <strong style={{ color: "var(--tz-acid-dim)" }}>{activeCount} active license{activeCount === 1 ? "" : "s"}</strong>.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <a
            href="/api/admin/customers/export"
            download
            className="tz-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ marginRight: 6 }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export CSV
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="tz-kpi acc">
          <div className="tz-kpi-label">Active licenses</div>
          <div className="tz-kpi-value tz-num" style={{ color: "var(--tz-acid-dim)" }}>{activeCount}</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Total users</div>
          <div className="tz-kpi-value tz-num">{rows.length}</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Conversion</div>
          <div className="tz-kpi-value tz-num">
            {rows.length > 0 ? `${Math.round((activeCount / rows.length) * 100)}%` : "—"}
          </div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">No license</div>
          <div className="tz-kpi-value tz-num">{rows.length - activeCount}</div>
        </div>
      </div>

      <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="tz-table" style={{ minWidth: 720 }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Signed up</th>
                <th>License</th>
                <th>Granted</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--tz-ink-mute)" }}>
                    No users yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.userId}>
                    <td>
                      <div style={{ color: "var(--tz-ink)", fontWeight: 500 }}>{r.email || "—"}</div>
                      <div className="tz-num" style={{ marginTop: 2, fontSize: 10.5, color: "var(--tz-ink-mute)" }}>
                        {r.userId}
                      </div>
                    </td>
                    <td>{r.name || <span style={{ color: "var(--tz-ink-mute)" }}>—</span>}</td>
                    <td className="tz-num" style={{ fontSize: 12 }}>
                      {r.signedUpAt ? new Date(r.signedUpAt).toISOString().slice(0, 10) : "—"}
                    </td>
                    <td>
                      {r.active ? (
                        <span className="tz-chip tz-chip-acid">
                          <span className="tz-chip-dot" />
                          Active
                        </span>
                      ) : (
                        <span className="tz-chip">No license</span>
                      )}
                    </td>
                    <td className="tz-num" style={{ fontSize: 12 }}>
                      {r.grantedAt ? new Date(r.grantedAt).toISOString().slice(0, 10) : "—"}
                    </td>
                    <td>
                      <span className="font-mono text-[11.5px]" style={{ color: "var(--tz-ink-mute)" }}>
                        {r.source || "—"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-[10.5px] font-mono uppercase tracking-widest"
        style={{ color: "var(--tz-ink-mute)" }}>
        Active licenses sorted first · Max 200 users
      </p>
    </>
  );
}
