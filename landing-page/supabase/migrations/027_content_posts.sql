-- Content publishing queue. Each row = one Instagram post we'll auto-publish.
-- Reels are not in scope here — Opus Clip handles those. This table covers
-- IG static + carousel posts that the daily Vercel cron pulls + publishes.
--
-- Tracks: which post is up next, what got published, what failed, and what
-- Meta returned (so we can link back to the live post for analytics later).
--
-- Source data is the 14-day-queue.json file under admin-assets/content/. The
-- /api/admin/content-posts/sync route imports new rows from JSON without
-- overwriting status of already-published rows (idempotent re-sync).

create table if not exists content_posts (
  id              uuid primary key default gen_random_uuid(),

  -- Identity within the queue. day is unique so re-syncing the same JSON
  -- row updates instead of inserting duplicates.
  day             integer not null unique,
  date            date,

  -- Post content. caption is the full pre-formatted text the cron pastes.
  -- image_prompt drives the OG image renderer when no manual asset is set.
  platform        text not null default 'instagram'
                    check (platform in ('instagram')),
  format          text not null
                    check (format in ('static','carousel','reel')),
  hook            text not null,
  caption         text not null,
  image_prompt    text,
  cta             text,
  keyword_target  text,
  slide_outline   jsonb default '[]'::jsonb,
  duration_seconds integer,

  -- Scheduling + status machine.
  scheduled_at    timestamptz,
  status          text not null default 'pending'
                    check (status in ('pending','publishing','published','failed','skipped')),

  -- Result fields populated after a publish attempt.
  ig_media_id     text,
  ig_permalink    text,
  error_message   text,
  attempts        integer not null default 0,
  published_at    timestamptz,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists content_posts_status_idx on content_posts(status);
create index if not exists content_posts_scheduled_idx on content_posts(scheduled_at);

-- Auto-update updated_at on row change.
create or replace function content_posts_touch() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists content_posts_touch on content_posts;
create trigger content_posts_touch
  before update on content_posts
  for each row execute function content_posts_touch();

-- RLS: service-role-only. Admin pages read via service role; cron runs server-side.
alter table content_posts enable row level security;

drop policy if exists "service role full access" on content_posts;
create policy "service role full access" on content_posts
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
