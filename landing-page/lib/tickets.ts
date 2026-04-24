import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export type TicketStatus = "open" | "waiting" | "resolved" | "closed";

export type Ticket = {
  id: string;
  user_id: string;
  subject: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
};

export type TicketMessage = {
  id: string;
  ticket_id: string;
  author: "customer" | "admin";
  author_id: string;
  body: string;
  created_at: string;
};

export async function listTicketsForUser(userId: string): Promise<Ticket[]> {
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa
      .from("tickets")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    return (data || []) as Ticket[];
  } catch {
    return [];
  }
}

export async function listAllTickets(
  filter: TicketStatus | "all" = "all",
): Promise<Ticket[]> {
  try {
    const supa = createSupabaseAdmin();
    const q = supa.from("tickets").select("*").order("updated_at", { ascending: false }).limit(200);
    if (filter !== "all") q.eq("status", filter);
    const { data } = await q;
    return (data || []) as Ticket[];
  } catch {
    return [];
  }
}

export async function getTicket(id: string): Promise<Ticket | null> {
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa.from("tickets").select("*").eq("id", id).maybeSingle();
    return (data as Ticket) || null;
  } catch {
    return null;
  }
}

export async function getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    return (data || []) as TicketMessage[];
  } catch {
    return [];
  }
}

export async function createTicket(params: {
  userId: string;
  subject: string;
  body: string;
}): Promise<{ id: string } | { error: string }> {
  const subject = params.subject.trim();
  const body = params.body.trim();
  if (!subject || subject.length > 140) return { error: "Subject required, max 140 chars" };
  if (!body || body.length > 5000) return { error: "Body required, max 5000 chars" };

  const supa = createSupabaseAdmin();
  const { data, error } = await supa
    .from("tickets")
    .insert({ user_id: params.userId, subject, status: "open" })
    .select("id")
    .single();
  if (error || !data) return { error: error?.message || "Unable to create ticket" };

  await supa.from("ticket_messages").insert({
    ticket_id: data.id,
    author: "customer",
    author_id: params.userId,
    body,
  });

  return { id: data.id };
}

export async function addMessage(params: {
  ticketId: string;
  author: "customer" | "admin";
  authorId: string;
  body: string;
  newStatus?: TicketStatus;
}): Promise<{ ok: true } | { error: string }> {
  const body = params.body.trim();
  if (!body || body.length > 5000) return { error: "Body required, max 5000 chars" };

  const supa = createSupabaseAdmin();
  const { error } = await supa.from("ticket_messages").insert({
    ticket_id: params.ticketId,
    author: params.author,
    author_id: params.authorId,
    body,
  });
  if (error) return { error: error.message };

  if (params.newStatus) {
    await supa.from("tickets").update({ status: params.newStatus }).eq("id", params.ticketId);
  }
  return { ok: true };
}

export async function setStatus(
  ticketId: string,
  status: TicketStatus,
): Promise<{ ok: true } | { error: string }> {
  const supa = createSupabaseAdmin();
  const { error } = await supa.from("tickets").update({ status }).eq("id", ticketId);
  if (error) return { error: error.message };
  return { ok: true };
}
