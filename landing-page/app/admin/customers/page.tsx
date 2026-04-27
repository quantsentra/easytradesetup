import { listAllUsers } from "@/lib/auth-server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import RevokeEntitlementButton from "@/components/admin/RevokeEntitlementButton";

type Row = {
  userId: string;
  email: string;
  name: string;
  signedUpAt: string | null;
  active: boolean;
  grantedAt: string | null;
  source: string | null;
};

type RawEnt = {
  userId: string;
  email: string;          // resolved from auth.users; "(orphan)" if no match
  active: boolean;
  grantedAt: string | null;
  source: string | null;
  amountCents: number | null;
  currency: string | null;
  stripeSessionId: string | null;
};

async function fetchRows(): Promise<{ joined: Row[]; raw: RawEnt[] }> {
  const users = await listAllUsers(200);
  const userById = new Map(users.map((u) => [u.id, u]));

  type EntCol = {
    user_id: string;
    active: boolean;
    granted_at: string;
    source: string;
    amount_cents: number | null;
    currency: string | null;
    stripe_session_id: string | null;
  };
  let entitlements: EntCol[] = [];
  try {
    const supa = createSupabaseAdmin();
    // Pull every column the revoke / audit flow needs. Fall back to a
    // smaller projection if migration 019 hasn't been applied.
    const { data, error } = await supa
      .from("entitlements")
      .select("user_id, active, granted_at, source, amount_cents, currency, stripe_session_id")
      .order("granted_at", { ascending: false });
    if (error) {
      const fallback = await supa
        .from("entitlements")
        .select("user_id, active, granted_at, source")
        .order("granted_at", { ascending: false });
      type MinRow = { user_id: string; active: boolean; granted_at: string; source: string };
      entitlements = ((fallback.data as MinRow[]) || []).map((r) => ({
        ...r,
        amount_cents: null, currency: null, stripe_session_id: null,
      })) as EntCol[];
    } else {
      entitlements = (data as EntCol[]) || [];
    }
  } catch {
    entitlements = [];
  }
  const byUser = new Map(entitlements.map((e) => [e.user_id, e]));

  const joined: Row[] = users.map((u) => {
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

  joined.sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    const aTs = a.signedUpAt ? Date.parse(a.signedUpAt) : 0;
    const bTs = b.signedUpAt ? Date.parse(b.signedUpAt) : 0;
    return bTs - aTs;
  });

  const raw: RawEnt[] = entitlements.map((e) => {
    const u = userById.get(e.user_id);
    return {
      userId: e.user_id,
      email: u?.email || "(orphan — no auth user)",
      active: e.active,
      grantedAt: e.granted_at,
      source: e.source,
      amountCents: e.amount_cents,
      currency: e.currency,
      stripeSessionId: e.stripe_session_id,
    };
  });

  return { joined, raw };
}

function fmtAmount(cents: number | null, currency: string | null): string {
  if (cents == null) return "—";
  const v = cents / 100;
  if ((currency || "").toLowerCase() === "inr") return `₹${v.toLocaleString("en-IN")}`;
  if ((currency || "").toLowerCase() === "usd") return `$${v.toFixed(2)}`;
  return `${v.toFixed(2)} ${(currency || "").toUpperCase()}`;
}

export default async function AdminCustomersPage() {
  const { joined: rows, raw } = await fetchRows();
  const activeCount = rows.filter((r) => r.active).length;
  const orphanCount = raw.filter((r) => r.email.startsWith("(orphan")).length;

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Customers.</h1>
          <div className="tz-topbar-sub">
            {rows.length} users · <strong style={{ color: "var(--tz-acid-dim)" }}>{activeCount} active license{activeCount === 1 ? "" : "s"}</strong>
            {orphanCount > 0 && (
              <> · <strong style={{ color: "var(--tz-amber)" }}>{orphanCount} orphan</strong></>
            )}.
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
          <div className="tz-kpi-label">Entitlement rows</div>
          <div className="tz-kpi-value tz-num">{raw.length}</div>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--tz-ink-mute)" }}>
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
                    <td>
                      {r.active && (
                        <RevokeEntitlementButton userId={r.userId} email={r.email} />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw entitlements — every row from the entitlements table directly,
          whether the user_id maps to an auth user or not. Use this to delete
          test/manual orders that don't appear in the joined table above. */}
      <div className="tz-card mt-6" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{
          padding: "18px 20px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div>
            <div className="tz-card-title">Raw entitlements · {raw.length}</div>
            <div className="tz-card-sub">
              Every row in <code>entitlements</code> table — including orphans without a matching auth user.
              Use this to revoke test or manual orders that don&apos;t show up in the joined view above.
            </div>
          </div>
        </div>
        {raw.length === 0 ? (
          <p className="text-[13.5px] p-6" style={{ color: "var(--tz-ink-mute)" }}>
            No entitlement rows.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tz-table" style={{ minWidth: 880 }}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Email / user</th>
                  <th>Source</th>
                  <th>Amount</th>
                  <th>Stripe session</th>
                  <th>Granted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {raw.map((r) => {
                  const isOrphan = r.email.startsWith("(orphan");
                  return (
                    <tr key={`${r.userId}-${r.grantedAt}`}>
                      <td>
                        {r.active ? (
                          <span className="tz-chip tz-chip-acid">
                            <span className="tz-chip-dot" />Active
                          </span>
                        ) : (
                          <span className="tz-chip">Inactive</span>
                        )}
                      </td>
                      <td>
                        <div style={{ color: isOrphan ? "var(--tz-amber)" : "var(--tz-ink)", fontWeight: 500 }}>
                          {r.email}
                        </div>
                        <div className="font-mono" style={{ marginTop: 2, fontSize: 10.5, color: "var(--tz-ink-mute)" }}>
                          {r.userId}
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-[11.5px]" style={{ color: "var(--tz-ink-mute)" }}>
                          {r.source || "—"}
                        </span>
                      </td>
                      <td className="tz-num" style={{ fontSize: 12 }}>
                        {fmtAmount(r.amountCents, r.currency)}
                      </td>
                      <td>
                        <span className="font-mono text-[11px]" style={{ color: "var(--tz-acid-dim)" }}>
                          {r.stripeSessionId
                            ? r.stripeSessionId.length > 22
                              ? r.stripeSessionId.slice(0, 18) + "…"
                              : r.stripeSessionId
                            : "—"}
                        </span>
                      </td>
                      <td className="tz-num" style={{ fontSize: 12 }}>
                        {r.grantedAt ? new Date(r.grantedAt).toISOString().slice(0, 10) : "—"}
                      </td>
                      <td>
                        <RevokeEntitlementButton userId={r.userId} email={r.email} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-[10.5px] font-mono uppercase tracking-widest"
        style={{ color: "var(--tz-ink-mute)" }}>
        Active licenses sorted first · Max 200 users · Raw view shows every entitlement row
      </p>
    </>
  );
}
