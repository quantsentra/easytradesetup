-- Add YouTube publishing fields to content_posts. Same row covers both
-- IG and YT publishing — separate ig_* and yt_* columns track each pipeline
-- independently, so a post can be live on IG but pending on YT (or vice
-- versa, or stuck on one but not the other).
--
-- Status fields are split because IG and YT can fail / succeed separately.
-- Cron routes only check + update their own platform's columns.

alter table content_posts
  add column if not exists yt_status        text not null default 'pending'
    check (yt_status in ('pending','publishing','published','failed','skipped')),
  add column if not exists yt_video_id      text,
  add column if not exists yt_url           text,
  add column if not exists yt_error_message text,
  add column if not exists yt_attempts      integer not null default 0,
  add column if not exists yt_published_at  timestamptz;

create index if not exists content_posts_yt_status_idx on content_posts(yt_status);

-- For posts that already exist (already-synced IG queue), default yt_status
-- to 'pending' so the YT cron picks them up. The DEFAULT 'pending' on the
-- column handles new rows; this UPDATE handles existing ones.
update content_posts set yt_status = 'pending' where yt_status is null;
