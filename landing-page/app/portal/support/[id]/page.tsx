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
      <div className="mb-6">
        <Link
          href="/portal/support"
          className="font-mono text-[11px] uppercase tracking-widest text-ink-40 hover:text-cyan"
        >
          ← All tickets
        </Link>
      </div>

      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Ticket · <span className="font-mono">{id.slice(0, 8)}</span>
      </span>
      <h1 className="mt-3 font-display text-[30px] font-semibold leading-[1.15] text-ink">
        {ticket.subject}
      </h1>
      <div className="mt-2 text-[12.5px] text-ink-60 uppercase tracking-widest font-mono">
        Status · {ticket.status}
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
                {m.author === "admin" ? "Support" : "You"}
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

      {ticket.status !== "closed" && (
        <form
          action={`/api/portal/tickets/${id}/messages`}
          method="POST"
          className="mt-10 glass-card-soft p-5 flex flex-col gap-3"
        >
          <textarea
            name="body"
            required
            rows={5}
            maxLength={5000}
            placeholder="Reply…"
            className="input"
          />
          <div>
            <button type="submit" className="btn btn-primary">
              Send reply →
            </button>
          </div>
        </form>
      )}

      {ticket.status === "closed" && (
        <div className="mt-10 glass-card-soft p-5 text-[14px] text-ink-60">
          This ticket is closed. Open a new one from the <Link href="/portal/support" className="text-cyan hover:underline">support page</Link> if you need further help.
        </div>
      )}
    </>
  );
}
