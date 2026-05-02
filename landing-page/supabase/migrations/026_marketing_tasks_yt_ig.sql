-- Narrow M1 + M2 to YouTube + Instagram only.
-- Founder explicitly opted out of X / Twitter, LinkedIn, Reddit
-- distribution. YT + IG = visual-first, single-content-pipeline,
-- both schedulable from Meta Business Suite (free) + YouTube Studio
-- without third-party tooling.
--
-- Drops: Typefully, Buffer, X account / posts, LinkedIn personal,
--        Reddit posts, pinned X thread.
-- Keeps: YouTube channel + monthly video + weekly short.
-- Adds:  Instagram account, weekly IG batch, IG reel cadence.

-- Re-seed M1 + M2 only. M0 / M3 / M4 untouched.
delete from marketing_tasks where tier in ('M1','M2');

insert into marketing_tasks (slug, tier, position, title, detail, link) values

  -- ============ M1 — AI content factory (YouTube + Instagram only) ============
  ('m1-yt-channel',         'M1', 1, 'Create YouTube channel "EasyTradeSetup" + banner + about',
   'Banner: chart-after.png. About: indicator + course + free risk calc. Link easytradesetup.com.', 'https://youtube.com/create_channel'),
  ('m1-ig-account',         'M1', 2, 'Set up Instagram @easytradesetup business account',
   'Pick "Business" account type so Meta Business Suite scheduling works. Profile pic = brand mark. Bio: trader voice + link in bio (use Linktree free or direct site link).', 'https://www.instagram.com/accounts/emailsignup/'),
  ('m1-meta-business-suite','M1', 3, 'Connect Instagram to Meta Business Suite (free scheduler)',
   'business.facebook.com → claim IG account. Native Meta scheduler — no Buffer / Typefully needed. Schedules feed posts, reels, stories.', 'https://business.facebook.com'),
  ('m1-prompt-library',     'M1', 4, 'Save 3 reusable AI prompt templates in Notion / Google Doc',
   'Templates: (1) IG carousel — 5-10 slides, hook on slide 1, value on 2-N, CTA on last. (2) IG reel script — 30-60s, hook in 2s. (3) YouTube long-form script — 8-12min outline. Each ends with brand voice + CTA rules. Reuse weekly.', null),
  ('m1-batch-1',            'M1', 5, 'AI-generate first batch — 10 IG carousels + 5 IG reels + schedule them',
   'Spend 1-2 hours with Claude / ChatGPT. Paste prompt template, ask for 10 carousel topics + 5 reel scripts, edit lightly. Schedule via Meta Business Suite — auto-publishes for 3-4 weeks of IG.', null),
  ('m1-yt-short-batch',     'M1', 6, 'Record + queue 3 YouTube Shorts (60s each)',
   'Phone vertical. Topics: "What is Lifeline?", "Free risk calc walkthrough", "Why most TradingView signals repaint". Upload via YT Studio with scheduled publish dates over next 3 weeks.', 'https://studio.youtube.com'),

  -- ============ M2 — Automated distribution (weekly 30min) ============
  ('m2-weekly-ig-batch',    'M2', 1, 'Weekly 30min — AI-generate 3 IG posts (2 carousels + 1 reel) + queue in Meta Business Suite',
   'Sunday morning. Reuse prompt templates from M1. Theme rotates: setup recap / rule of thumb / risk lesson / chart of the week.', 'https://business.facebook.com'),
  ('m2-weekly-yt-short',    'M2', 2, 'Weekly — 1 YouTube Short (60s, repurpose the week''s best IG reel)',
   '5min effort: re-export the IG reel without watermark, upload to YT Studio. Same content, second platform, zero extra creative time.', 'https://studio.youtube.com'),
  ('m2-monthly-yt-long',    'M2', 3, 'Monthly — 1 YouTube long-form video (8-12min)',
   'Last weekend of month. Topics: setup walkthrough / "I tested X indicators" / strategy of the month. AI script + screen recording (OBS / Loom free tier).', null),
  ('m2-monthly-ig-story',   'M2', 4, 'Monthly — 1 Instagram Story highlight reel update',
   'Stories show on profile as pinned highlights ("Setups", "Course", "Free Tools"). Update once a month. 5min effort. Drives profile-visit conversion.', null)

on conflict (slug) do nothing;
