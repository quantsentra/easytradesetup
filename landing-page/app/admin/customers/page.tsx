import { clerkClient } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

type Row = {
  userId: string;
  email: string;
  name: string;
  signedUpAt: number | null;
  active: boolean;
  grantedAt: string | null;
  source: string | null;
};

async function fetchRows(): Promise<Row[]> {
  const client = await clerkClient();
  const { data: users, totalCount } = await client.users.getUserList({ limit: 200 });

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
    const first = u.firstName || "";
    const last = u.lastName || "";
    const name = [first, last].filter(Boolean).join(" ") || u.username || "";
    return {
      userId: u.id,
      email: u.primaryEmailAddress?.emailAddress || "",
      name,
      signedUpAt: u.createdAt,
      active: ent?.active === true,
      grantedAt: ent?.granted_at || null,
      source: ent?.source || null,
    };
  });

  // Active licenses first, then by signup desc.
  rows.sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return (b.signedUpAt || 0) - (a.signedUpAt || 0);
  });

  return rows.slice(0, Math.min(rows.length, totalCount));
}

export default async function AdminCustomersPage() {
  const rows = await fetchRows();
  const activeCount = rows.filter((r) => r.active).length;

  return (
    <>
      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Admin · customers
      </span>
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-ink">
        Customers.
      </h1>
      <p className="mt-3 text-[15px] text-ink-60">
        {rows.length} users · {activeCount} with active license.
      </p>

      <div className="mt-10 glass-card-soft overflow-x-auto">
        <table className="w-full text-[13px] min-w-[720px]">
          <thead>
            <tr className="text-left">
              <Th>Email</Th>
              <Th>Name</Th>
              <Th>Signed up</Th>
              <Th>License</Th>
              <Th>Granted</Th>
              <Th>Source</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink-60">
                  No users yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.userId} className="hairline-t">
                  <Td>
                    <span className="text-ink font-medium">{r.email || "—"}</span>
                    <div className="mt-0.5 font-mono text-[10.5px] text-ink-40">{r.userId}</div>
                  </Td>
                  <Td>{r.name || <span className="text-ink-40">—</span>}</Td>
                  <Td>
                    {r.signedUpAt
                      ? new Date(r.signedUpAt).toISOString().slice(0, 10)
                      : "—"}
                  </Td>
                  <Td>
                    {r.active ? (
                      <span className="chip chip-acid">Active</span>
                    ) : (
                      <span className="chip">No license</span>
                    )}
                  </Td>
                  <Td>
                    {r.grantedAt ? new Date(r.grantedAt).toISOString().slice(0, 10) : "—"}
                  </Td>
                  <Td>
                    <span className="font-mono text-[11.5px] text-ink-60">{r.source || "—"}</span>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-nano font-mono uppercase tracking-widest text-ink-40">
        Active licenses shown first · Max 200 users per page
      </p>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-4 font-mono text-[10.5px] uppercase tracking-widest text-ink-40 font-bold">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 align-top">{children}</td>;
}
