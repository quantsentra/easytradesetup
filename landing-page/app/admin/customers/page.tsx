import { listAllUsers } from "@/lib/auth-server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import CustomerTable, { type CustomerRow } from "@/components/admin/CustomerTable";
import RawEntitlementsTable, { type RawEntRow } from "@/components/admin/RawEntitlementsTable";

export const metadata = {
  title: "Customers · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function fetchRows(): Promise<{ joined: CustomerRow[]; raw: RawEntRow[] }> {
  const users = await listAllUsers(500);
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

  const joined: CustomerRow[] = users.map((u) => {
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

  const raw: RawEntRow[] = entitlements.map((e) => {
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
        <div className="tz-card-head" style={{
          padding: "16px 18px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div style={{ minWidth: 0 }}>
            <div className="tz-card-title">Users · {rows.length}</div>
            <div className="tz-card-sub">Search · sort · filter · paginate · export.</div>
          </div>
        </div>
        <CustomerTable rows={rows} />
      </div>

      {/* Raw entitlements — every row from the entitlements table directly,
          whether the user_id maps to an auth user or not. Use this to delete
          test/manual orders that don't appear in the joined table above. */}
      <div className="tz-card mt-6" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{
          padding: "16px 18px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div style={{ minWidth: 0 }}>
            <div className="tz-card-title">Raw entitlements · {raw.length}</div>
            <div className="tz-card-sub">
              Every row in <code>entitlements</code> table — including orphans without a matching auth user.
              Use this to revoke test or manual orders that don&apos;t show up in the joined view above.
            </div>
          </div>
        </div>
        <RawEntitlementsTable rows={raw} />
      </div>
    </>
  );
}
