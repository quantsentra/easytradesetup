import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { listTicketsForUser, type Ticket } from "@/lib/tickets";

const STATUS_LABEL: Record<Ticket["status"], string> = {
  open: "Open",
  waiting: "Waiting on support",
  resolved: "Resolved",
  closed: "Closed",
};

export default async function SupportPage() {
  const user = await currentUser();
  const tickets = user ? await listTicketsForUser(user.id) : [];

  return (
    <>
      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Support
      </span>
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-ink">
        Open a ticket.
      </h1>
      <p className="mt-3 text-[15px] text-ink-60 max-w-[640px]">
        Install questions, licensing, strategies, anything else. Founder replies within 24 hours.
      </p>

      <form
        action="/api/portal/tickets"
        method="POST"
        className="mt-10 glass-card-soft p-6 flex flex-col gap-4"
      >
        <Field label="Subject">
          <input
            name="subject"
            required
            maxLength={140}
            placeholder="Indicator not loading on TradingView"
            className="input"
          />
        </Field>
        <Field label="Message" hint="Plain text. Up to 5000 characters.">
          <textarea
            name="body"
            required
            rows={8}
            maxLength={5000}
            placeholder="Describe the issue, what you tried, any error messages, the symbol + timeframe."
            className="input"
          />
        </Field>
        <div>
          <button type="submit" className="btn btn-primary">
            Open ticket →
          </button>
        </div>
      </form>

      <h2 className="mt-16 h-card">Your tickets</h2>
      <div className="mt-5 flex flex-col gap-3">
        {tickets.length === 0 ? (
          <div className="glass-card-soft p-6 text-[14px] text-ink-60">No tickets yet.</div>
        ) : (
          tickets.map((t) => (
            <Link
              key={t.id}
              href={`/portal/support/${t.id}`}
              className="feat-card !p-5 hover:border-rule-3 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[15px] font-semibold text-ink min-w-0 truncate">
                  {t.subject}
                </h3>
                <StatusChip status={t.status} />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-[12px] text-ink-60">
                <span>Opened {new Date(t.created_at).toISOString().slice(0, 10)}</span>
                <time className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40">
                  Last activity {new Date(t.updated_at).toISOString().slice(0, 10)}
                </time>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}

function Field({
  label, hint, children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40">{label}</span>
      {children}
      {hint && <span className="text-[12px] text-ink-60">{hint}</span>}
    </label>
  );
}

function StatusChip({ status }: { status: Ticket["status"] }) {
  const cls =
    status === "open"
      ? "chip chip-acid"
      : status === "waiting"
      ? "chip chip-new"
      : status === "resolved"
      ? "chip"
      : "chip";
  return <span className={cls}>{STATUS_LABEL[status]}</span>;
}
