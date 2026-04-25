import Link from "next/link";
import { getUser } from "@/lib/auth-server";
import { listTicketsForUser, type Ticket } from "@/lib/tickets";

const STATUS_LABEL: Record<Ticket["status"], string> = {
  open: "Open",
  waiting: "Waiting on support",
  resolved: "Resolved",
  closed: "Closed",
};

export default async function SupportPage() {
  const user = await getUser();
  const tickets = user ? await listTicketsForUser(user.id) : [];

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Support.</h1>
          <div className="tz-topbar-sub">
            Install questions, licensing, strategies — founder replies within 24 hours.
          </div>
        </div>
      </div>

      <form
        action="/api/portal/tickets"
        method="POST"
        className="tz-card flex flex-col gap-4"
      >
        <div>
          <label className="tz-field-label">Subject</label>
          <input
            name="subject"
            required
            maxLength={140}
            placeholder="Indicator not loading on TradingView"
            className="tz-input"
          />
        </div>
        <div>
          <label className="tz-field-label">Message</label>
          <textarea
            name="body"
            required
            rows={7}
            maxLength={5000}
            placeholder="Describe the issue, what you tried, any error messages, the symbol + timeframe."
            className="tz-input"
          />
          <div className="mt-1.5 text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>
            Plain text · up to 5000 characters
          </div>
        </div>
        <div>
          <button type="submit" className="tz-btn tz-btn-primary">
            Open ticket →
          </button>
        </div>
      </form>

      <h2 className="mt-10 mb-4 tz-card-title">Your tickets</h2>
      <div className="flex flex-col gap-2.5">
        {tickets.length === 0 ? (
          <div className="tz-card" style={{ color: "var(--tz-ink-mute)", fontSize: 14 }}>
            No tickets yet.
          </div>
        ) : (
          tickets.map((t) => (
            <Link key={t.id} href={`/portal/support/${t.id}`} className="tz-tilerow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[14.5px] font-semibold truncate" style={{ color: "var(--tz-ink)" }}>
                    {t.subject}
                  </h3>
                  <StatusChip status={t.status} />
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2 text-[12px]"
                  style={{ color: "var(--tz-ink-mute)" }}>
                  <span>Opened {new Date(t.created_at).toISOString().slice(0, 10)}</span>
                  <time className="font-mono text-[10.5px] uppercase tracking-widest">
                    Activity {new Date(t.updated_at).toISOString().slice(0, 10)}
                  </time>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}

function StatusChip({ status }: { status: Ticket["status"] }) {
  const cls =
    status === "open" ? "tz-chip tz-chip-acid" :
    status === "waiting" ? "tz-chip tz-chip-amber" :
    "tz-chip";
  return (
    <span className={cls}>
      {status === "open" && <span className="tz-chip-dot" />}
      {STATUS_LABEL[status]}
    </span>
  );
}
