import Link from "next/link";
import { notFound } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { getTicket, getTicketMessages, type TicketStatus } from "@/lib/tickets";

const STATUS_OPTIONS: TicketStatus[] = ["open", "waiting", "resolved", "closed"];

async function customerEmail(userId: string): Promise<string> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.primaryEmailAddress?.emailAddress || userId;
  } catch {
    return userId;
  }
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
      <div className="mb-6">
        <Link
          href="/admin/tickets"
          className="font-mono text-[11px] uppercase tracking-widest text-ink-40 hover:text-cyan"
        >
          ← Inbox
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="eye">
            <span className="eye-dot" aria-hidden />
            Ticket · <span className="font-mono">{id.slice(0, 8)}</span>
          </span>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-[1.15] text-ink">
            {ticket.subject}
          </h1>
          <div className="mt-2 text-[13px] text-ink-60">
            From <strong className="text-ink">{email}</strong> · opened{" "}
            {new Date(ticket.created_at).toISOString().slice(0, 10)}
          </div>
        </div>

        <form
          action={`/api/admin/tickets/${id}/status`}
          method="POST"
          className="flex items-center gap-2"
        >
          <select
            name="status"
            defaultValue={ticket.status}
            className="input !py-1.5 !px-3 !w-auto font-mono text-[12px] uppercase tracking-widest"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-outline !py-1.5 !px-3 text-[12px]">
            Update
          </button>
        </form>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {messages.map((m) => (
          <article
            key={m.id}
            className={`feat-card !p-5 ${m.author === "admin" ? "border-rule-3" : ""}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={
                  m.author === "admin"
                    ? "font-mono text-[10.5px] font-bold uppercase tracking-widest text-cyan"
                    : "font-mono text-[10.5px] font-bold uppercase tracking-widest text-ink-40"
                }
              >
                {m.author === "admin" ? "Admin" : "Customer"}
              </span>
              <time className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40">
                {new Date(m.created_at).toISOString().slice(0, 16).replace("T", " ")}
              </time>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-[14.5px] leading-[1.6] text-ink">
              {m.body}
            </p>
          </article>
        ))}
      </div>

      <form
        action={`/api/admin/tickets/${id}/messages`}
        method="POST"
        className="mt-10 glass-card-soft p-5 flex flex-col gap-3"
      >
        <textarea
          name="body"
          required
          rows={6}
          maxLength={5000}
          placeholder="Reply to the customer…"
          className="input"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-primary">
            Send reply →
          </button>
          <label className="flex items-center gap-2 text-[13px] text-ink-60">
            <input type="checkbox" name="resolve" value="1" className="w-4 h-4" />
            Mark resolved after reply
          </label>
        </div>
      </form>
    </>
  );
}
