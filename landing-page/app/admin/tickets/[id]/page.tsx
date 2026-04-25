import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/auth-server";
import { getTicket, getTicketMessages, type TicketStatus } from "@/lib/tickets";

const STATUS_OPTIONS: TicketStatus[] = ["open", "waiting", "resolved", "closed"];

async function customerEmail(userId: string): Promise<string> {
  const u = await getUserById(userId);
  return u?.email || userId;
}

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicket(id);
  if (!ticket) notFound();

  const [messages, email] = await Promise.all([
    getTicketMessages(id),
    customerEmail(ticket.user_id),
  ]);

  return (
    <>
      <Link
        href="/admin/tickets"
        className="inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-widest mb-4"
        style={{ color: "var(--tz-ink-mute)" }}
      >
        ← Inbox
      </Link>

      <div className="tz-topbar">
        <div className="min-w-0 flex-1">
          <span className="tz-chip">
            <span className="tz-chip-dot" style={{ background: "var(--tz-acid)" }} />
            Ticket · <span className="font-mono">{id.slice(0, 8)}</span>
          </span>
          <h1 className="tz-topbar-title mt-3">{ticket.subject}</h1>
          <div className="tz-topbar-sub">
            From <strong style={{ color: "var(--tz-ink)" }}>{email}</strong> · opened{" "}
            {new Date(ticket.created_at).toISOString().slice(0, 10)}
          </div>
        </div>

        <form
          action={`/api/admin/tickets/${id}/status`}
          method="POST"
          className="flex items-center gap-2 self-start"
        >
          <select
            name="status"
            defaultValue={ticket.status}
            className="tz-input font-mono uppercase tracking-widest"
            style={{ height: 34, padding: "0 32px 0 12px", fontSize: 12, width: "auto" }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="submit" className="tz-btn">Update</button>
        </form>
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
                {m.author === "admin" ? "Admin" : "Customer"}
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

      <form
        action={`/api/admin/tickets/${id}/messages`}
        method="POST"
        className="mt-8 tz-card flex flex-col gap-3"
      >
        <textarea
          name="body"
          required
          rows={6}
          maxLength={5000}
          placeholder="Reply to the customer…"
          className="tz-input"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="tz-btn tz-btn-primary">
            Send reply →
          </button>
          <label className="flex items-center gap-2 text-[13px]" style={{ color: "var(--tz-ink-dim)" }}>
            <input type="checkbox" name="resolve" value="1" className="w-4 h-4" />
            Mark resolved after reply
          </label>
        </div>
      </form>
    </>
  );
}
