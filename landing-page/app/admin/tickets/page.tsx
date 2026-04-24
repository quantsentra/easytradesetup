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
    s === "open" ? "chip chip-acid" :
    s === "waiting" ? "chip chip-new" :
    "chip";
  return <span className={cls}>{s}</span>;
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
      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Admin · tickets
      </span>
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-ink">
        Support inbox.
      </h1>
      <p className="mt-3 text-[15px] text-ink-60">
        {tickets.length} ticket{tickets.length === 1 ? "" : "s"} in <strong>{filter}</strong> state.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {ALL_STATUSES.map((s) => {
          const active = s === filter;
          const qs = s === "all" ? "?status=all" : `?status=${s}`;
          return (
            <Link
              key={s}
              href={`/admin/tickets${qs}`}
              className={
                active
                  ? "chip chip-acid capitalize"
                  : "chip capitalize hover:border-rule-3"
              }
            >
              {s}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {tickets.length === 0 ? (
          <div className="glass-card-soft p-6 text-[14px] text-ink-60">
            No tickets match this filter.
          </div>
        ) : (
          tickets.map((t) => (
            <Link
              key={t.id}
              href={`/admin/tickets/${t.id}`}
              className="feat-card !p-5 hover:border-rule-3 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-semibold text-ink truncate">{t.subject}</h3>
                  <div className="mt-1 text-[12.5px] text-ink-60 flex flex-wrap items-center gap-2">
                    <span>{emailMap.get(t.user_id) || t.user_id}</span>
                    <span className="text-ink-40">·</span>
                    <span>Last activity {new Date(t.updated_at).toISOString().slice(0, 10)}</span>
                  </div>
                </div>
                {statusChip(t.status)}
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
