import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { listIssues } from "@/lib/hermes/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Returns the daily Claude Code prompt with #N pre-filled for the
// oldest open hermes issue. Client copies the response text to
// clipboard, opens Claude Code, pastes, and the article gets drafted.
//
// This is the "remaining one manual step" in the otherwise-clicked
// daily routine. Reason: drafting needs a Claude session, and the
// user's Claude Code subscription only runs interactively, not via
// API. So we make pasting the prompt as low-friction as possible.

const PROMPT_TEMPLATE = (issueNumber: number, title: string) =>
`Draft GitHub issue #${issueNumber} from quantsentra/easytradesetup. Issue title: "${title}".

Read the issue body for the brief. Then:

1. Read /docs/seo/brand-voice.md and /docs/seo/publishing-rules.md for tone + checklist
2. Read landing-page/app/(marketing)/blog/best-indicator-for-nifty-options/page.tsx as a reference for length, structure, JSON-LD wiring, AND mobile responsiveness patterns (sm: breakpoint usage on text sizes, padding, headings)
3. Pick the hero image:
   - Read landing-page/public/blog-images/README.md for the folder taxonomy
   - Map the article topic to a folder:
       indian       → NIFTY / BANKNIFTY / NSE / Indian equities / India F&O
       us           → SPX / NASDAQ / DOW / US equities / US options
       crypto-forex → BTC / ETH / forex pairs (EURUSD etc)
       gold         → XAU / silver / commodities
       generic      → cross-market or non-market topics
   - List files in that folder and pick the MOST RECENT by date in filename
   - If folder is empty, fall back to landing-page/public/blog-images/generic/
   - Set the heroImage path on the lib/blog.ts entry (relative to /public, e.g. "/blog-images/indian/NIFTY-baseline.png")
   - Write a descriptive heroAlt that includes the market name + what the chart shows
4. Write the article TSX at landing-page/app/(marketing)/blog/<slug>/page.tsx
   - Read post.heroImage in the metadata.openGraph.images and ArticleJsonLd image
   - Use post.heroImage + post.heroAlt for the <Image> tag in the hero section
   - Use sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px" on the Image
   - Wrap the image in max-w-5xl mx-auto so it doesn't dominate desktop
5. Append entry to landing-page/lib/blog.ts (slug, title, metaTitle, metaDescription, excerpt, hook, primaryKeyword, secondaryKeywords, audienceTier, pillar, datePublished, readMinutes, heroImage, heroAlt)
6. Add paper-trail markdown at /content/blog/<slug>.md following _TEMPLATE-blog-article.md
7. Add smoke test row to landing-page/tests/e2e/pages.spec.ts ({ path: "/blog/<slug>", mustContain: /<keyword regex>/i })
8. Run: npx tsc --noEmit and npm run build to verify
9. Commit and push directly to main (sales-priority shipping mode active)
10. Tell me the live URL and the commit hash

Constraints:
- No banned terms anywhere (guaranteed, secret, 100%, no loss, sure shot)
- Inline risk callout in any section that names a setup or P&L hypothetical
- Footer disclaimer block mandatory
- ≥3 internal links to /sample /product /pricing /compare /docs/faq
- Sales focus is the indicator — soft CTAs only ("See the sample", "See the bundle", "Lock inaugural")
- Length 1,000–1,800 words
- Author field: "EasyTradeSetup Editorial"

Layout standard (international blog typography — non-negotiable):
- Body text MUST be wrapped in <div className="blog-prose">. This class lives in app/globals.css and handles font sizes, line height, h2/h3 spacing, lists, links, code, and the .risk-note callout. Do NOT inline text-[16px] / leading-[1.75] / space-y-* in the prose body.
- Hero title block + image + TL;DR + body all sit in container-wide with explicit max-w containers:
    Title block: <div className="mx-auto" style={{ maxWidth: 760 }}>
    Hero image:  <div className="mx-auto" style={{ maxWidth: 1024 }}>
    TL;DR + body + footer disclaimer + meta: <div className="mx-auto" style={{ maxWidth: 680 }}>  (or use .blog-prose which sets max-width 680 internally)
    In-body CTA card + read-next: <div className="mx-auto" style={{ maxWidth: 760 }}>
- Risk callouts in body use <div className="risk-note"><strong>Risk note</strong>...</div> — styled by globals.css.
- Hero title uses inline clamp() font size, NOT h-display class:
    <h1 className="font-display font-semibold text-ink leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)" }}>
- Image uses figure + figcaption pattern with sizes attribute.
- CTA buttons in flex row: w-full sm:w-auto justify-center so they stack on mobile and lay out side-by-side on desktop.
- Reference the live first article at landing-page/app/(marketing)/blog/best-indicator-for-nifty-options/page.tsx for the exact pattern. Copy its structure, just change the content.
`;

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  try {
    const open = await listIssues({ labels: ["hermes"], state: "open", perPage: 30 });
    if (open.length === 0) {
      return NextResponse.json({
        ok: false,
        error: "No open hermes issues. Click 'Refill backlog' first to mine new topics.",
      }, { status: 404 });
    }

    // Oldest open = most aged in queue = ship-first.
    const oldest = open.sort((a, b) => a.number - b.number)[0];

    return NextResponse.json({
      ok:           true,
      issueNumber:  oldest.number,
      issueTitle:   oldest.title,
      issueUrl:     oldest.html_url,
      prompt:       PROMPT_TEMPLATE(oldest.number, oldest.title),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
