import Link from "next/link";
import { emailsByUserIds } from "@/lib/auth-server";
import { listAllTickets, type Ticket, type TicketStatus } from "@/lib/tickets";

const ALL_STATUSES: Array<TicketStatus | "all"> = [
  "open",
  "waiting",
  "resolved",
  "closed",
  "all",
];

type SearchParams = Promise<{ status?: string }>;

function statusChip(s: Ticket["status"]) {
  const cls =
    s === "open" ? "tz-chip tz-chip-acid" :
    s === "waiting" ? "tz-chip tz-chip-amber" :
    s === "resolved" ? "tz-chip tz-chip-win" :
    "tz-chip";
  return (
    <span className={cls}>
      {s === "open" && <span className="tz-chip-dot" />}
      {s}
    </span>
  );
}

export default async function AdminTicketsPage({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;
  const filter = (ALL_STATUSES.includes(status as TicketStatus | "all") ? status : "open") as
    | TicketStatus
    | "all";

  const tickets = await listAllTickets(filter);
  const emailMap = await emailsByUserIds(Array.from(new Set(tickets.map((t) => t.user_id))));

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Support inbox.</h1>
          <div className="tz-topbar-sub">
            {tickets.length} ticket{tickets.length === 1 ? "" : "s"} in <strong>{filter}</strong> state.
          </div>
        </div>
      </div>

      <div className="tz-tabbar mb-6">
        {ALL_STATUSES.map((s) => {
          const active = s === filter;
          const qs = s === "all" ? "?status=all" : `?status=${s}`;
          return (
            <Link
              key={s}
              href={`/admin/tickets${qs}`}
              className={`tz-tabpill capitalize ${active ? "active" : ""}`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-2.5">
        {tickets.length === 0 ? (
          <div className="tz-card" style={{ color: "var(--tz-ink-mute)", fontSize: 14 }}>
            No tickets match this filter.
          </div>
        ) : (
          tickets.map((t) => (
            <Link key={t.id} href={`/admin/tickets/${t.id}`} className="tz-tilerow">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[14.5px] font-semibold truncate" style={{ color: "var(--tz-ink)" }}>
                      {t.subject}
                    </h3>
                    <div className="mt-1 text-[12px] flex flex-wrap items-center gap-2"
                      style={{ color: "var(--tz-ink-mute)" }}>
                      <span>{emailMap.get(t.user_id) || t.user_id}</span>
                      <span style={{ color: "var(--tz-ink-faint)" }}>·</span>
                      <span>Activity {new Date(t.updated_at).toISOString().slice(0, 10)}</span>
                    </div>
                  </div>
                  {statusChip(t.status)}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
