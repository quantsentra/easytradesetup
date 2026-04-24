-- Support tickets. Customers open them in /portal/support;
-- admins answer in /admin/tickets. RLS is on; the app uses the
-- service-role key for all reads/writes, so policies are deny-all
-- for the anon key (defense-in-depth).

create table if not exists tickets (
  id           uuid        primary key default gen_random_uuid(),
  user_id      text        not null,                 -- Clerk user ID
  subject      text        not null,
  status       text        not null default 'open'
                          check (status in ('open','waiting','resolved','closed')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists tickets_user_created_idx on tickets (user_id, created_at desc);
create index if not exists tickets_status_updated_idx on tickets (status, updated_at desc);

alter table tickets enable row level security;
create policy "no anon access to tickets"
  on tickets for all using (false) with check (false);

-- Ticket messages. First row is the customer's opener; subsequent
-- rows alternate between customer and admin. `author` = 'customer'
-- or 'admin' so we can render bubbles correctly without joining
-- against an admins table on every render.
create table if not exists ticket_messages (
  id           uuid        primary key default gen_random_uuid(),
  ticket_id    uuid        not null references tickets(id) on delete cascade,
  author       text        not null check (author in ('customer','admin')),
  author_id    text        not null,                 -- Clerk user ID of whoever wrote it
  body         text        not null,
  created_at   timestamptz not null default now()
);

create index if not exists ticket_messages_ticket_created_idx
  on ticket_messages (ticket_id, created_at asc);

alter table ticket_messages enable row level security;
create policy "no anon access to ticket messages"
  on ticket_messages for all using (false) with check (false);

-- Bump tickets.updated_at whenever a new message lands, so the
-- admin inbox can sort by last-activity without a subquery.
create or replace function bump_ticket_updated_at()
  returns trigger language plpgsql as $$
begin
  update tickets set updated_at = now() where id = new.ticket_id;
  return new;
end;
$$;

drop trigger if exists ticket_messages_bump on ticket_messages;
create trigger ticket_messages_bump
  after insert on ticket_messages
  for each row execute function bump_ticket_updated_at();
