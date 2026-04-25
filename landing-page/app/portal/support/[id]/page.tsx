import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import { getTicket, getTicketMessages } from "@/lib/tickets";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const ticket = await getTicket(id);
  if (!user || !ticket || ticket.user_id !== user.id) notFound();

  const messages = await getTicketMessages(id);

  return (
    <>
      <Link href="/portal/support" className="inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-widest mb-4"
        style={{ color: "var(--tz-ink-mute)" }}>
        ← All tickets
      </Link>

      <div className="tz-topbar">
        <div className="min-w-0">
          <span className="tz-chip">
            <span className="tz-chip-dot" style={{ background: "var(--tz-acid)" }} />
            Ticket · <span className="font-mono">{id.slice(0, 8)}</span>
          </span>
          <h1 className="tz-topbar-title mt-3">{ticket.subject}</h1>
          <div className="tz-topbar-sub font-mono uppercase tracking-widest text-[11px]">
            Status · {ticket.status}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {messages.map((m) => (
          <article key={m.id} className="tz-card" style={{
            borderColor: m.author === "admin" ? "rgba(107,159,30,0.25)" : "var(--tz-border)",
            background: m.author === "admin"
              ? "linear-gradient(135deg, rgba(107,159,30,0.04) 0%, transparent 60%), var(--tz-surface)"
              : "var(--tz-surface)",
          }}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest"
                style={{ color: m.author === "admin" ? "var(--tz-acid-dim)" : "var(--tz-ink-mute)" }}>
                {m.author === "admin" ? "Support" : "You"}
              </span>
              <time className="font-mono text-[10.5px] uppercase tracking-widest"
                style={{ color: "var(--tz-ink-mute)" }}>
                {new Date(m.created_at).toISOString().slice(0, 16).replace("T", " ")}
              </time>
            </div>
            <p className="whitespace-pre-wrap text-[14.5px] leading-[1.6]" style={{ color: "var(--tz-ink)" }}>
              {m.body}
            </p>
          </article>
        ))}
      </div>

      {ticket.status !== "closed" ? (
        <form
          action={`/api/portal/tickets/${id}/messages`}
          method="POST"
          className="mt-8 tz-card flex flex-col gap-3"
        >
          <textarea
            name="body"
            required
            rows={5}
            maxLength={5000}
            placeholder="Reply…"
            className="tz-input"
          />
          <div>
            <button type="submit" className="tz-btn tz-btn-primary">
              Send reply →
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 tz-card" style={{ color: "var(--tz-ink-mute)", fontSize: 14 }}>
          This ticket is closed. Open a new one from{" "}
          <Link href="/portal/support" style={{ color: "var(--tz-acid-dim)" }}>support</Link>.
        </div>
      )}
    </>
  );
}
