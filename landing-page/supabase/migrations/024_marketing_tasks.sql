-- Marketing checklist — durable backlog for the post-launch motion.
-- Mirrors mvp_tasks (007) shape so admin UI can reuse the TaskCheckbox
-- + toggle pattern. Tier scheme is M0-M5 instead of P0-P5.
--
-- Frozen-list rule (same as mvp_tasks): app code only toggles done
-- and edits notes; the canonical task list lives here in migrations.

create table if not exists marketing_tasks (
  slug          text        primary key,
  tier          text        not null check (tier in ('M0','M1','M2','M3','M4','M5')),
  position      integer     not null,
  title         text        not null,
  detail        text,
  link          text,                          -- optional outbound link (e.g. tool signup)
  done          boolean     not null default false,
  done_at       timestamptz,
  done_by       text,
  note          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists marketing_tasks_tier_idx on marketing_tasks (tier, position);

alter table marketing_tasks enable row level security;
create policy "no anon access to marketing_tasks"
  on marketing_tasks for all using (false) with check (false);

-- Seed: post-launch marketing motion. Tiers grouped by leverage:
--   M0 — pre-launch one-time setup that gates everything else
--   M1 — content engine (week 1)
--   M2 — distribution cadence (ongoing)
--   M3 — programmatic SEO + email nurture
--   M4 — analytics + optimization
--   M5 — paid acquisition (only after organic baseline)
insert into marketing_tasks (slug, tier, position, title, detail, link) values
  -- ============ M0 — pre-launch setup ============
  ('m0-stripe-live',        'M0', 1, 'Verify Stripe sk_live_ on Vercel + run a real test purchase',
   'Test from a separate account. Confirm: webhook fires, entitlement row inserts, magic link emails, portal unlocks.', null),
  ('m0-resend-domain',      'M0', 2, 'Confirm Resend DKIM + SPF green for easytradesetup.com',
   'Send a test from welcome@. Check inbox + spam in Gmail, Outlook, Yahoo.', 'https://resend.com/domains'),
  ('m0-uptime-cron',        'M0', 3, 'Wire cron-job.org to ping /api/cron/uptime every 5min',
   'Bearer header: $CRON_SECRET. URL: https://www.easytradesetup.com/api/cron/uptime', 'https://cron-job.org'),
  ('m0-search-console',     'M0', 4, 'Submit sitemap to Google Search Console',
   'sitemap URL: https://www.easytradesetup.com/sitemap.xml. Verify ownership via meta tag (env: GOOGLE_SITE_VERIFICATION).', 'https://search.google.com/search-console'),
  ('m0-ga4',                'M0', 5, 'Set up Google Analytics 4 property + paste measurement ID',
   'Already have Vercel Analytics + Microsoft Clarity. GA4 is the SEO tracker advertisers and Search Console expect.', 'https://analytics.google.com'),
  ('m0-bing-webmaster',     'M0', 6, 'Submit sitemap to Bing Webmaster Tools',
   'Bing serves Yahoo + DuckDuckGo organic. ~5min. env: BING_SITE_VERIFICATION.', 'https://www.bing.com/webmasters'),
  ('m0-founder-photo',      'M0', 7, 'Replace placeholder with real founder photo + bio on /about',
   'Trust signal. Square crop, ~800x800. Real name, year started trading, why you built this.', null),

  -- ============ M1 — content engine, week 1 ============
  ('m1-yt-channel',         'M1', 1, 'Create YouTube channel "EasyTradeSetup" with banner + about',
   'Upload chart-after.png as banner. About section: indicator + course + free risk calc. Link to easytradesetup.com.', 'https://youtube.com/create_channel'),
  ('m1-x-account',          'M1', 2, 'Set up X / Twitter account @easytradesetup',
   'Pinned tweet: thread #1 from playbook. Profile pic = brand mark. Bio: trader voice, link.', 'https://x.com'),
  ('m1-typefully',          'M1', 3, 'Sign up for Typefully — schedule 30 days of X content',
   'Free tier covers 1 thread queue. Paid ($15/mo) unlocks analytics.', 'https://typefully.com'),
  ('m1-linkedin',           'M1', 4, 'Set up LinkedIn page + first 3 posts',
   'India IT/finance professionals do intraday. Voice: more measured than X.', 'https://linkedin.com/company/setup'),
  ('m1-thread-1',           'M1', 5, 'Publish X thread #1 — "I built a Pine v5 indicator. Here is what is inside."',
   '10 tweets. Hook: most indicators give one thing, mine fuses 6 layers. End: free risk calc + sample setup link.', null),
  ('m1-yt-video-1',         'M1', 6, 'Record + publish YouTube video #1 — "I tested 5 free TradingView indicators on NIFTY"',
   '12min. Show win/loss tally on screen. Reveal Lifeline at 8min. CTA: free risk calc + samples.', null),
  ('m1-reddit-post',        'M1', 7, 'Post on r/StockMarketIndia — "Built a NIFTY indicator after losing on 30+ subscription tools"',
   'Read sub rules first. No spam karma allowed. Value first, link last. Be ready to answer comments.', 'https://reddit.com/r/StockMarketIndia'),
  ('m1-hindi-tagline',      'M1', 8, 'Verify Hindi tagline still on TrustStrip post-launch',
   'India-first signal. Already shipped. Just confirm rendered correctly on mobile.', null),

  -- ============ M2 — ongoing distribution cadence ============
  ('m2-x-daily',            'M2', 1, 'Daily X post — 1 setup recap or chart insight',
   '5 days/week minimum. Use Typefully queue. Theme: yesterday is plot, today is plan.', null),
  ('m2-x-thread-weekly',    'M2', 2, 'Weekly X thread on a setup or rule (10 tweets)',
   'Tuesday morning IST. Rotate: Lifeline / Magnetic Zone / signal psychology / risk firewall.', null),
  ('m2-yt-weekly',          'M2', 3, 'YouTube — 1 video/week, ~10-15min',
   'Topics: setup walkthroughs, comparison videos, "I tested" formats. End screen pushes free sample.', null),
  ('m2-reddit-weekly',      'M2', 4, 'Reddit — 1 high-value post + 5 comments per week',
   'r/IndianStreetBets (intraday focus), r/StockMarketIndia, r/tradingview. Karma first, link later.', null),
  ('m2-linkedin-3x',        'M2', 5, 'LinkedIn — 3 posts/week (Mon/Wed/Fri)',
   'Frame for finance professionals. Less casual than X. Story + lesson + link.', null),
  ('m2-tg-channel',         'M2', 6, 'Optional: Telegram broadcast channel (NOT a group)',
   'Channel only — no community moderation burden. Daily 1 chart post with Lifeline annotation. Free, builds list.', 'https://telegram.org'),

  -- ============ M3 — SEO + email nurture ============
  ('m3-prog-seo-extend',    'M3', 1, 'Add 6 more programmatic /indicator/[market] pages',
   'Templates: reliance, tcs, hdfc (NSE singles), silver, crude (commodities), eth, sol (crypto). 30min batch.', null),
  ('m3-blog-section',       'M3', 2, 'Add /blog with first 3 SEO-optimised posts',
   'Posts: "How to read CPR on NIFTY", "Lifeline vs 200 EMA", "Why most TradingView signals repaint". Each 1500+ words.', null),
  ('m3-email-day0',         'M3', 3, 'Resend template — Day 0 welcome email',
   'Already wired in /api/lead. Verify content matches latest brand voice + free sample link.', null),
  ('m3-email-day3',         'M3', 4, 'Resend template + cron — Day 3 nurture email',
   '"Why I built Golden Indicator" — story + pain. Schedule via Resend cron or Supabase row + cron job.', null),
  ('m3-email-day7',         'M3', 5, 'Resend template + cron — Day 7 nurture email',
   '"5 setups inside the indicator — pick yours" — value reveal.', null),
  ('m3-email-day14',        'M3', 6, 'Resend template + cron — Day 14 nurture email',
   'Soft-scarcity reminder: lifetime price still active. No fake urgency.', null),
  ('m3-twelve-data',        'M3', 7, 'Wire Twelve Data API key for live quotes ticker',
   'Hero ticker upgrade. env: TWELVE_DATA_API_KEY. Free tier: 800 reqs/day = enough for ticker rotation.', 'https://twelvedata.com'),

  -- ============ M4 — analytics + optimization ============
  ('m4-clarity-funnel',     'M4', 1, 'Set up conversion funnel in Microsoft Clarity',
   'Funnel: home -> sample -> checkout -> thank-you. Watch where users drop.', 'https://clarity.microsoft.com'),
  ('m4-utm-discipline',     'M4', 2, 'Tag every external campaign URL with UTM params',
   'utm_source=twitter / utm_medium=thread / utm_campaign=launch-week-1. Spreadsheet of templates.', null),
  ('m4-conversion-target',  'M4', 3, 'Set target: 3% lead-to-purchase, 0.5% visitor-to-purchase',
   'Standard SaaS-with-trial benchmarks. If below at month 2, optimise pricing page.', null),
  ('m4-ab-pricing',         'M4', 4, 'A/B test: ₹4,599 vs ₹3,999 vs ₹5,499',
   'Wait until 100+ purchases for statistical significance. Vercel Edge Config + cookie-based split.', null),

  -- ============ M5 — paid acquisition ============
  ('m5-google-search',      'M5', 1, 'Google Search ads — long-tail keywords',
   '"nifty intraday strategy", "tradingview pine indicator", "best banknifty indicator". Start ₹500/day. Watch CAC.', 'https://ads.google.com'),
  ('m5-meta-retarget',      'M5', 2, 'Meta retargeting — visitors who saw /sample but did not buy',
   'Audience: site-visitors-no-purchase, last 30 days. Creative: "You read the sample. Now read the rest."', 'https://business.facebook.com'),
  ('m5-x-promoted',         'M5', 3, 'X promoted thread — best-performing organic thread first',
   'Cheaper than Meta for trader audience. Boost the thread that already worked organically.', null),
  ('m5-affiliate-program',  'M5', 4, 'Set up affiliate program — 30% lifetime commission',
   'One-time payout structure (since product is one-time). Tools: Rewardful, Trolley, or DIY in Stripe.', 'https://rewardful.com')
on conflict (slug) do nothing;
