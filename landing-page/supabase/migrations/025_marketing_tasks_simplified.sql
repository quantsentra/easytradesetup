-- Simplified marketing checklist for solo, AI-first founder.
-- Replaces the 024 seed. Optimised for minimum manual time:
--   * AI writes drafts (Claude / ChatGPT free tier)
--   * Free schedulers run distribution (Typefully free, Buffer free)
--   * Programmatic SEO + email drips set up once, harvest for years
-- Dropped from 024: paid acquisition (M5), daily cadence, A/B pricing,
-- affiliate program, Twelve Data live quotes — none are leverage for
-- a one-person operation pre-100-customer mark.
--
-- Tier scheme tightened to M0-M4. Re-running this file is idempotent.

-- 1. Tighten tier constraint to M0-M4 (M5 dropped).
alter table marketing_tasks drop constraint if exists marketing_tasks_tier_check;
alter table marketing_tasks add constraint marketing_tasks_tier_check
  check (tier in ('M0','M1','M2','M3','M4'));

-- 2. Wipe prior seed so the new task set is the source of truth.
--    Toggle state for tasks that survive (by slug) is preserved by
--    re-inserting with on conflict do nothing AFTER the delete pass —
--    but since we rewrite slugs to match the new framing, a clean
--    delete is correct. If you'd already ticked tasks under 024, jot
--    them down before running this file.
delete from marketing_tasks;

insert into marketing_tasks (slug, tier, position, title, detail, link) values

  -- ============ M0 — Foundation (one-time, gates everything) ============
  ('m0-stripe-live',        'M0', 1, 'Verify Stripe sk_live_ on Vercel + run a real test purchase',
   'Test from a separate account. Confirm: webhook fires, entitlement row inserts, magic link emails, portal unlocks.', null),
  ('m0-resend-domain',      'M0', 2, 'Confirm Resend DKIM + SPF green for easytradesetup.com',
   'Send a test from welcome@. Check inbox + spam in Gmail, Outlook, Yahoo.', 'https://resend.com/domains'),
  ('m0-uptime-cron',        'M0', 3, 'Wire cron-job.org to ping /api/cron/uptime every 5min',
   'Bearer header: $CRON_SECRET. URL: https://www.easytradesetup.com/api/cron/uptime', 'https://cron-job.org'),
  ('m0-search-console',     'M0', 4, 'Submit sitemap to Google Search Console',
   'sitemap URL: https://www.easytradesetup.com/sitemap.xml. Verify ownership via meta tag (env: GOOGLE_SITE_VERIFICATION).', 'https://search.google.com/search-console'),
  ('m0-ga4',                'M0', 5, 'Set up Google Analytics 4 + paste measurement ID',
   'Already have Vercel Analytics + Microsoft Clarity. GA4 is the SEO tracker advertisers and Search Console expect.', 'https://analytics.google.com'),
  ('m0-bing-webmaster',     'M0', 6, 'Submit sitemap to Bing Webmaster Tools',
   'Bing serves Yahoo + DuckDuckGo organic. ~5min. env: BING_SITE_VERIFICATION.', 'https://www.bing.com/webmasters'),
  ('m0-founder-photo',      'M0', 7, 'Replace placeholder with real founder photo + bio on /about',
   'Trust signal. Square crop ~800x800. Real name, year started trading, why you built this.', null),

  -- ============ M1 — AI content factory (one-time setup) ============
  -- Goal: spend one weekend wiring the assembly line, then weekly batches feed it.
  ('m1-yt-channel',         'M1', 1, 'Create YouTube channel "EasyTradeSetup" + banner + about',
   'Banner: chart-after.png. About: indicator + course + free risk calc. Link easytradesetup.com.', 'https://youtube.com/create_channel'),
  ('m1-x-account',          'M1', 2, 'Set up X / Twitter @easytradesetup',
   'Profile pic = brand mark. Bio: trader voice + link. Pinned tweet later (M1 task).', 'https://x.com'),
  ('m1-linkedin-page',      'M1', 3, 'Set up LinkedIn personal post-handle (no separate page needed)',
   'India IT/finance professionals do intraday. Post from your personal handle — more reach than a brand page early on.', 'https://linkedin.com'),
  ('m1-typefully',          'M1', 4, 'Sign up Typefully (free tier) for X scheduling',
   'Free covers 1 thread queue + scheduled single posts. Drafts + queue.', 'https://typefully.com'),
  ('m1-buffer',             'M1', 5, 'Sign up Buffer (free tier) for LinkedIn scheduling',
   'Free: 10 scheduled posts per channel. Enough for 2-3 weeks of LinkedIn at our cadence.', 'https://buffer.com'),
  ('m1-prompt-library',     'M1', 6, 'Save 5 reusable AI prompt templates in Notion / Google Doc',
   'Templates: X post, X thread, LinkedIn post, YouTube script, blog post. Each template ends with brand voice + CTA rules. Reuse weekly.', null),
  ('m1-batch-1',            'M1', 7, 'AI-generate first batch — 30 X posts + 10 LinkedIn posts + schedule them',
   'Spend 1-2 hours with Claude / ChatGPT. Paste prompt template, ask for 30 variants, edit lightly, paste into Typefully + Buffer queues. Auto-publishes for 3-4 weeks.', null),
  ('m1-pinned-tweet',       'M1', 8, 'Pin first X thread once published (M2 step makes it).',
   'Pinned thread = best converter for new visitors. Refresh whenever a new thread outperforms.', null),

  -- ============ M2 — Automated distribution (weekly 30min batches) ============
  -- Goal: one focused 30-min sprint per week tops up the queues.
  ('m2-weekly-x-batch',     'M2', 1, 'Weekly 30min — AI-generate 5-7 X posts + queue in Typefully',
   'Sunday morning. Reuse prompt template. Theme rotates: setup recap / rule of thumb / risk lesson / chart of the week.', null),
  ('m2-weekly-li-batch',    'M2', 2, 'Weekly 30min — AI-generate 2-3 LinkedIn posts + queue in Buffer',
   'Same Sunday slot. Frame for finance professionals: less casual, more "lessons learned" tone.', null),
  ('m2-monthly-thread',     'M2', 3, 'Monthly — 1 X thread (AI draft, you edit, publish)',
   'First Tuesday of the month. 10 tweets. Topics: Lifeline rules / Magnetic Zone / signal psychology / risk firewall.', null),
  ('m2-monthly-yt',         'M2', 4, 'Monthly — 1 YouTube video (AI script + screen recording, ~10min)',
   'Last weekend of month. Topics: setup walkthrough / "I tested X indicators" / strategy of the month.', null),
  ('m2-monthly-reddit',     'M2', 5, 'Monthly — 1 Reddit post (AI draft, you edit for sub voice, publish)',
   'r/StockMarketIndia or r/IndianStreetBets or r/tradingview. Read sub rules first. Value-first — link in body, not title.', 'https://reddit.com/r/StockMarketIndia'),

  -- ============ M3 — SEO autopilot (one-time + drips) ============
  -- Goal: set up once, harvests organic traffic for years with zero ongoing time.
  ('m3-prog-seo-extend',    'M3', 1, 'Add 6 more programmatic /indicator/[market] pages',
   'Templates: reliance, tcs, hdfc (NSE singles), silver, crude (commodities), eth, sol (crypto). 30min batch — AI fills the per-market copy.', null),
  ('m3-blog-section',       'M3', 2, 'Add /blog with 5 AI-drafted SEO posts',
   'Topics: "How to read CPR on NIFTY", "Lifeline vs 200 EMA", "Why most TradingView signals repaint", "Risk-first intraday playbook", "What we learned from 100 NIFTY trades". Each 1500+ words. Edit AI drafts for voice.', null),
  ('m3-email-day0',         'M3', 3, 'Resend Day 0 welcome email — verify content',
   'Already wired in /api/lead. Confirm copy matches latest brand voice + free sample link.', null),
  ('m3-email-day3',         'M3', 4, 'Resend Day 3 nurture email — "Why I built Golden Indicator"',
   'AI-draft the founder story. Pain → product → free sample CTA. Schedule via Resend cron or Supabase row + cron-job.org.', null),
  ('m3-email-day7',         'M3', 5, 'Resend Day 7 nurture email — "5 setups inside the indicator, pick yours"',
   'Value reveal. Lifeline / Magnetic Zone / VWAP / CPR / Volume Burst — one paragraph each. CTA: full course unlocks on purchase.', null),
  ('m3-email-day14',        'M3', 6, 'Resend Day 14 nurture email — soft-scarcity reminder',
   'Lifetime price still active. No fake countdown. Just a one-liner reminder + last call to grab launch pricing.', null),
  ('m3-nurture-cron',       'M3', 7, 'Wire the Day 3/7/14 emails to fire automatically',
   'Pattern: lead row stores created_at; nightly cron-job.org pings /api/cron/nurture; route picks rows where (now - created_at) crossed Day 3/7/14 boundary in last 24h. One-time wiring.', 'https://cron-job.org'),

  -- ============ M4 — Measure + iterate (lightweight) ============
  ('m4-clarity-funnel',     'M4', 1, 'Set up conversion funnel in Microsoft Clarity',
   'Funnel: home -> sample -> checkout -> thank-you. Watch heatmaps + dropoffs. Free, no SDK changes (Clarity already wired).', 'https://clarity.microsoft.com'),
  ('m4-utm-discipline',     'M4', 2, 'UTM-tag every external campaign URL',
   'utm_source=twitter / utm_medium=thread / utm_campaign=launch. Save a Google Doc with templates so you copy-paste.', null),
  ('m4-weekly-search',      'M4', 3, 'Weekly 5min — check Search Console top queries',
   'Sunday after the content batch. Note which queries are trending up. Feed those into the next month''s blog topics.', null),
  ('m4-monthly-review',     'M4', 4, 'Monthly 30min — review which /indicator + /blog pages convert best',
   'Use Clarity + GA4. Double down on the winners (more programmatic variants). Kill or rewrite the losers.', null),
  ('m4-conversion-target',  'M4', 5, 'Set + track conversion target: 3% lead→buy, 0.5% visit→buy',
   'Standard SaaS-with-trial benchmarks. Below at month 2? Optimise pricing page or sample page first — they''re the highest-leverage edits.', null)

on conflict (slug) do nothing;
