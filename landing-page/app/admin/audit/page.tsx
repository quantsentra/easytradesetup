import { listAuditLog } from "@/lib/audit";

export default async function AdminAuditPage() {
  const rows = await listAuditLog(150);

  return (
    <>
      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Admin · audit log
      </span>
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-ink">
        Audit log.
      </h1>
      <p className="mt-3 text-[15px] text-ink-60 max-w-[640px]">
        Chronological record of privileged actions. Latest 150 rows.
      </p>

      <div className="mt-10 glass-card-soft overflow-x-auto">
        <table className="w-full text-[13px] min-w-[720px]">
          <thead>
            <tr className="text-left">
              <Th>At</Th>
              <Th>Actor</Th>
              <Th>Action</Th>
              <Th>Target</Th>
              <Th>Metadata</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-60">
                  No audit entries yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hairline-t">
                  <Td>
                    <span className="font-mono text-[11.5px]">
                      {new Date(r.at).toISOString().slice(0, 19).replace("T", " ")}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-[11.5px] text-ink-60">
                      {r.actor_id.slice(0, 16)}…
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-[11.5px] text-cyan">{r.action}</span>
                  </Td>
                  <Td>
                    {r.target_kind ? (
                      <>
                        <span className="text-ink-60">{r.target_kind}</span>
                        {r.target_id && (
                          <span className="font-mono text-[11px] text-ink-40">
                            {" · "}
                            {r.target_id.length > 16
                              ? `${r.target_id.slice(0, 16)}…`
                              : r.target_id}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-ink-40">—</span>
                    )}
                  </Td>
                  <Td>
                    <pre className="font-mono text-[11px] text-ink-60 whitespace-pre-wrap max-w-[360px]">
                      {JSON.stringify(r.metadata, null, 0)}
                    </pre>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
