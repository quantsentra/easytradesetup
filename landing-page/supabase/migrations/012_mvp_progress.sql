-- Mark p1-og-verify done.
-- Run after 011. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'OG image rewritten — brand-aligned (navy bg, cyan-blue gradient text + brand-mark, gold accent on INR). Sources prices from lib/pricing.ts. Edge runtime, 1200x630 PNG, cached 1yr immutable. /opengraph-image returns 200 with correct image/png content-type. Twitter card = summary_large_image, alt text + locale en_IN. Theme color now #05070F (brand navy) so mobile browser chrome matches backdrop. To re-verify after launch: paste www.easytradesetup.com into linkedin.com/post-inspector + developers.facebook.com/tools/debug + cards-dev.twitter.com/validator.',
    updated_at = now()
where slug = 'p1-og-verify' and done = false;
