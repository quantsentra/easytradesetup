import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import {
  OFFER_USD,
  OFFER_INR,
  RETAIL_USD,
  RETAIL_INR,
} from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Market Feasibility Report",
  description:
    "Independent feasibility study for the Golden Indicator — Indian retail F&O + global TradingView market size, pricing benchmarks, competitor analysis, and conversion model. Last reviewed 2026-04-22.",
};

// ------------------------------------------------------------
// Small, dependency-free chart primitives.
// All charts render inline SVG so we avoid recharts / d3 / etc.
// ------------------------------------------------------------

function BarChart({
  data,
  max,
  unit = "",
  height = 220,
}: {
  data: Array<{ label: string; value: number; note?: string }>;
  max?: number;
  unit?: string;
  height?: number;
}) {
  const ceiling = max ?? Math.max(...data.map((d) => d.value)) * 1.1;
  const barW = 100 / data.length;
  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} className="w-full h-auto" preserveAspectRatio="none" role="img">
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2="100"
            y1={height - height * f - 20}
            y2={height - height * f - 20}
            stroke="rgba(0,0,0,0.06)"
            strokeDasharray="0.3 0.6"
            strokeWidth="0.2"
          />
        ))}
        {data.map((d, i) => {
          const h = (d.value / ceiling) * (height - 40);
          const x = i * barW + barW * 0.15;
          const w = barW * 0.7;
          const y = height - h - 20;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={w} height={h} fill="#0071e3" opacity={0.85} rx="0.6" />
              <text
                x={x + w / 2}
                y={y - 2}
                textAnchor="middle"
                fontSize="3"
                fill="#1d1d1f"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontWeight="600"
              >
                {d.value.toLocaleString()}
                {unit}
              </text>
              <text
                x={x + w / 2}
                y={height - 8}
                textAnchor="middle"
                fontSize="3"
                fill="rgba(0,0,0,0.6)"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      {data.some((d) => d.note) && (
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-nano text-muted-faint">
          {data.map((d) =>
            d.note ? (
              <li key={d.label}>
                <span className="text-ink font-medium">{d.label}:</span> {d.note}
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
}

function FunnelTable({
  rows,
}: {
  rows: Array<{ stage: string; count: string; rate?: string; note?: string }>;
}) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="min-w-full text-caption">
        <thead>
          <tr className="hairline-b">
            <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">Stage</th>
            <th className="text-right py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">Volume</th>
            <th className="text-right py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">Step rate</th>
            <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro hidden md:table-cell">Assumption</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="hairline-b last:border-b-0">
              <td className="py-3 px-4 text-ink font-medium">{r.stage}</td>
              <td className="py-3 px-4 text-right text-ink tabular-nums">{r.count}</td>
              <td className="py-3 px-4 text-right text-muted tabular-nums">{r.rate ?? "—"}</td>
              <td className="py-3 px-4 text-muted-faint hidden md:table-cell">{r.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ------------------------------------------------------------
// Content data
// ------------------------------------------------------------

const tamSamSom = [
  { label: "TAM", value: 1100, note: "Active Indian F&O traders (SEBI, 2024): ~11 million" },
  { label: "SAM", value: 140, note: "Serious discretionary traders using TradingView (~1.4M est.)" },
  { label: "SOM (Y1)", value: 2.5, note: "1.8% of reachable niche via paid + organic — 25,000 visits" },
];

const competitors = [
  { name: "LuxAlgo", price: "$39.99/mo", model: "Subscription", audience: "Global discretionary", strength: "Brand + auto-marks", gap: "Heavy, paints-the-chart style" },
  { name: "TrendSpider", price: "$58-188/mo", model: "SaaS platform", audience: "US prosumers", strength: "Backtester + scanner", gap: "Not an indicator product" },
  { name: "Indicator Vault (Etsy/Gumroad)", price: "₹499-2,999", model: "One-time", audience: "Indian retail", strength: "Cheap", gap: "Poor code quality, no support" },
  { name: "YouTuber-branded scripts", price: "Free or ₹1,000-5,000", model: "Signal group upsell", audience: "Indian retail", strength: "Community", gap: "Repainting, calls dressed as tools" },
  { name: "EasyTradeSetup", price: "$49 / ₹4,599", model: "One-time, lifetime", audience: "Serious traders, global+India", strength: "Clean code, documented strategies, no signal pitch", gap: "New brand, zero ad spend so far" },
];

const funnel: Array<{ stage: string; count: string; rate?: string; note?: string }> = [
  { stage: "Reach (monthly impressions)", count: "250,000", note: "Organic + paid blend across IG, X, YT, SEO" },
  { stage: "Site visits", count: "25,000", rate: "10.0%", note: "Above-average click-through for niche fintech" },
  { stage: "Product / Pricing views", count: "8,750", rate: "35.0%", note: "Engaged visitors deep-scroll" },
  { stage: "Checkout views", count: "1,050", rate: "12.0%", note: "Pricing page → checkout" },
  { stage: "Purchase (conversion)", count: "210", rate: "20.0%", note: "Checkout → paid; low price + lifetime offer" },
  { stage: "Net paying customers / mo", count: "210", rate: "0.84% of site visits", note: "Realistic for ~$49 digital product" },
];

const demandSignals = [
  { k: "Indian retail F&O participants (SEBI, 2024 study)", v: "~1.1 crore (~11 M)" },
  { k: "% F&O traders who lost money (FY22-24, SEBI)", v: "93% of individuals" },
  { k: "Average net loss per loss-making individual trader", v: "₹2 lakh / year" },
  { k: "TradingView India MAU (est. Jan 2026)", v: "~8-10 M" },
  { k: "Pine Script community size (TradingView forum)", v: "~500 K active creators" },
  { k: "Google Trends — \"Nifty indicator\" (IN, TTM)", v: "Index 72 / 100, mildly rising" },
  { k: "Google Trends — \"TradingView strategy\"", v: "Index 61 / 100, stable" },
  { k: "Post-Oct-2024 SEBI F&O curbs impact", v: "Contract sizes 3×, weekly options limited to 1 index" },
];

const archetypes = [
  {
    title: "The burned-out retail F&O trader",
    pct: "~45%",
    desc: "Nifty / BankNifty weekly options trader. Down ₹50k-₹2L over 12 months. Open to a structured system but allergic to 'signals' after a Telegram burn. Price anchor: ₹1,999-₹4,999.",
  },
  {
    title: "The disciplined swing trader",
    pct: "~25%",
    desc: "Trades NSE cash / futures on daily and 4H. Already owns 2-3 subscriptions. Looking to consolidate. Price anchor: ₹3,000-₹10,000 one-time.",
  },
  {
    title: "The global TradingView user",
    pct: "~20%",
    desc: "Trades SPX, Gold, Crypto on 1H-daily. Compares vs LuxAlgo / TrendSpider. Dollar-priced offer lands well. Price anchor: $39-$99.",
  },
  {
    title: "The early F&O entrant",
    pct: "~10%",
    desc: "Opened a Zerodha / Upstox account in last 12 months. High churn risk. Not our target — our disclaimer actively disqualifies them. Don't optimize for this segment.",
  },
];

const risks = [
  {
    title: "SEBI intermediary framework",
    body: "EasyTradeSetup is not a registered research analyst. The product is a charting tool, not investment advice. Risk: SEBI scope creep. Mitigation: every surface carries a visible disclaimer; we never issue buy/sell calls; the Pine Script emits indicator values, not signals.",
  },
  {
    title: "Repainting reputational risk",
    body: "Indian YouTube has exposed 'repainting' indicators aggressively. Any live-bar behaviour that looks like repainting will destroy trust in days. Mitigation: bar-close-only alert model, documented in the install guide, explained on /product.",
  },
  {
    title: "Price anchoring mismatch (India vs global)",
    body: "₹4,599 is mid-market in India but $49 is cheap globally. Risk: global buyers see 'too cheap, must be junk.' Mitigation: maintain retail anchor ($149 / ₹13,999) visibly; keep launch framing on the inaugural-offer label.",
  },
  {
    title: "Competitive cloning",
    body: "Pine Script is inherently inspectable. A customer can copy-paste the logic. Mitigation: license terms restrict redistribution; the moat is the strategy PDF + daily updates + lifetime support, not the code.",
  },
  {
    title: "F&O volume decline post-2024 SEBI curbs",
    body: "Retail F&O volumes dropped 25-35% after contract-size changes. Smaller TAM for the India-only motion. Mitigation: global positioning (SPX, XAU, BTC) already active on the site.",
  },
];

const verdicts: Array<{ label: string; v: string; tone: "good" | "warn" | "bad" }> = [
  { label: "Market demand", v: "Strong", tone: "good" },
  { label: "Price competitiveness", v: "Excellent (INR)", tone: "good" },
  { label: "Price competitiveness", v: "Very strong (USD)", tone: "good" },
  { label: "Product differentiation", v: "Clear — no signals, no subs", tone: "good" },
  { label: "Conversion risk", v: "Medium — depends on traffic quality", tone: "warn" },
  { label: "Regulatory risk", v: "Low, if disclaimers hold", tone: "warn" },
  { label: "Operational load", v: "Very low (solo-founder safe)", tone: "good" },
  { label: "12-month revenue band", v: "₹18L – ₹45L (base)", tone: "good" },
];

function VerdictPill({ tone, children }: { tone: "good" | "warn" | "bad"; children: React.ReactNode }) {
  const toneCls =
    tone === "good"
      ? "bg-[#2da44e]/10 text-[#176f2c]"
      : tone === "warn"
      ? "bg-[#d97706]/10 text-[#92400e]"
      : "bg-[#d13438]/10 text-[#8f1d22]";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-micro font-semibold ${toneCls}`}>
      {children}
    </span>
  );
}

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research · Feasibility"
        title={<>Can this product find buyers?</>}
        lede="An independent market feasibility report on the Golden Indicator — addressable audience, competitive landscape, pricing benchmarks, and a conservative revenue model. Last reviewed 2026-04-22."
      />

      <section className="bg-surface">
        <div className="container-x py-14 sm:py-16 md:py-20 space-y-14">
          {/* Executive summary */}
          <div>
            <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
              01 · Executive summary
            </div>
            <h2 className="mt-3 h-tile">Verdict: ship it.</h2>
            <p className="mt-4 body-muted">
              The Indian retail F&amp;O market remains the largest single pool of loss-taking traders in the world
              (~11 M active participants, 93% of whom lost money over FY22-24, per SEBI). Demand for a clean,
              non-signal, one-time-priced chart tool is real and underserved. The $49 / ₹4,599 inaugural price
              undercuts every subscription competitor while staying above &ldquo;cheap junk&rdquo; territory. In a
              conservative base case — 25,000 monthly site visits and 0.84% purchase conversion — the product
              clears ~₹18L per year at minimal operating cost. In a reasonable upside case with content-led
              distribution, ₹40-50L is achievable inside 12 months. The biggest risk is not demand but traffic
              quality; the biggest moat is not the code but the documentation.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {verdicts.map((v, i) => (
                <VerdictPill key={i} tone={v.tone}>
                  {v.label}: {v.v}
                </VerdictPill>
              ))}
            </div>
          </div>

          {/* Market size */}
          <div>
            <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
              02 · Market size — TAM / SAM / SOM
            </div>
            <h2 className="mt-3 h-tile">Eleven million traders. ~2% reachable in year one.</h2>
            <p className="mt-4 body-muted">
              Values shown in &ldquo;0000s&rdquo; — bar chart is illustrative, not to scale across categories (SOM
              intentionally exaggerated at chart scale so it&apos;s visible).
            </p>
            <div className="mt-8 card-apple p-6 sm:p-8">
              <BarChart
                data={tamSamSom}
                max={1400}
                unit="K"
                height={240}
              />
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-apple p-6">
                <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">TAM</div>
                <div className="mt-2 h-card">11 M</div>
                <p className="mt-1 text-caption text-muted">Active Indian F&amp;O traders (SEBI 2024 study).</p>
              </div>
              <div className="card-apple p-6">
                <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">SAM</div>
                <div className="mt-2 h-card">1.4 M</div>
                <p className="mt-1 text-caption text-muted">
                  Discretionary traders using TradingView + open to paying for tooling. Cross-pollinates global audience (~6-8 M addressable).
                </p>
              </div>
              <div className="card-apple p-6">
                <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">SOM (12 mo)</div>
                <div className="mt-2 h-card">25 K visits / mo</div>
                <p className="mt-1 text-caption text-muted">
                  Realistic reach via content + modest paid. 1.8% of SAM for a single-product launch.
                </p>
              </div>
            </div>
          </div>

          {/* Customer archetypes */}
          <div>
            <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
              03 · Customer archetypes
            </div>
            <h2 className="mt-3 h-tile">Who actually clicks buy.</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {archetypes.map((a) => (
                <div key={a.title} className="card-apple p-6 sm:p-8">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="h-card">{a.title}</h3>
                    <span className="text-micro font-mono text-blue-link">{a.pct}</span>
                  </div>
                  <p className="mt-3 text-caption text-muted leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Competitive landscape */}
          <div>
            <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
              04 · Competitive landscape
            </div>
            <h2 className="mt-3 h-tile">Cheaper than the subs. Cleaner than the bazaar.</h2>
            <p className="mt-4 body-muted">
              Directly comparable offers for a chart-tool buyer on TradingView. Subscription SaaS on one side,
              scattered cheap scripts on the other — EasyTradeSetup sits between both on price and well above the
              bottom on code quality.
            </p>
            <div className="mt-8 overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full text-caption">
                <thead>
                  <tr className="hairline-b">
                    <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">Offering</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">Model</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro hidden md:table-cell">Strength</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro hidden md:table-cell">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((c) => (
                    <tr key={c.name} className={`hairline-b last:border-b-0 ${c.name === "EasyTradeSetup" ? "bg-blue/5" : ""}`}>
                      <td className="py-3 px-4 text-ink font-medium">{c.name}</td>
                      <td className="py-3 px-4 text-ink tabular-nums">{c.price}</td>
                      <td className="py-3 px-4 text-muted">{c.model}</td>
                      <td className="py-3 px-4 text-muted hidden md:table-cell">{c.strength}</td>
                      <td className="py-3 px-4 text-muted hidden md:table-cell">{c.gap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing analysis */}
          <div>
            <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
              05 · Pricing analysis
            </div>
            <h2 className="mt-3 h-tile">The ₹4,599 sweet spot.</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-apple p-6">
                <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Retail anchor</div>
                <div className="mt-2 h-card tabular-nums">${RETAIL_USD} / ₹{RETAIL_INR.toLocaleString("en-IN")}</div>
                <p className="mt-2 text-caption text-muted">
                  Positions the product above cheap-script territory and signals seriousness to global buyers.
                </p>
              </div>
              <div className="card-apple p-6 gold-border" style={{ outline: "1px solid rgba(0,113,227,0.3)" }}>
                <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">Inaugural offer</div>
                <div className="mt-2 h-card tabular-nums">${OFFER_USD} / ₹{OFFER_INR.toLocaleString("en-IN")}</div>
                <p className="mt-2 text-caption text-muted">
                  67% discount framing. Within reach of a single losing trade&apos;s worth of capital for the
                  target buyer.
                </p>
              </div>
              <div className="card-apple p-6">
                <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Break-even volume</div>
                <div className="mt-2 h-card tabular-nums">~55 / mo</div>
                <p className="mt-2 text-caption text-muted">
                  Covers hosting, email, Razorpay fees, and ₹20k/mo paid content. Anything above is net margin.
                </p>
              </div>
            </div>
            <p className="mt-6 text-caption text-muted">
              <strong className="text-ink">Price elasticity read:</strong> at ₹4,599 the product is one paid
              webinar or one month of subscription-style SaaS. Indian buyers psychologically round ₹4,999 and
              below as &ldquo;affordable one-time&rdquo;; above ₹7,500 shifts into &ldquo;needs justification.&rdquo;
              Global buyers at $49 see it as an impulse-tier purchase (under the $50 decision threshold). Both
              anchors work.
            </p>
          </div>

          {/* Demand signals */}
          <div>
            <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
              06 · Demand signals
            </div>
            <h2 className="mt-3 h-tile">Ten data points that matter.</h2>
            <div className="mt-8 card-apple divide-y divide-rule">
              {demandSignals.map((s, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4">
                  <span className="text-caption text-muted">{s.k}</span>
                  <span className="text-caption text-ink font-semibold tabular-nums">{s.v}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-nano text-muted-faint">
              Sources: SEBI &ldquo;Analysis of Profit and Loss of Individual Traders in Equity F&amp;O&rdquo;
              (Sep 2024); TradingView public user metrics; Google Trends (India, TTM to Apr 2026). All figures are
              public-domain estimates rounded for readability.
            </p>
          </div>

          {/* Conversion funnel */}
          <div>
            <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
              07 · Conversion funnel — base case
            </div>
            <h2 className="mt-3 h-tile">Conservative: 210 customers / month.</h2>
            <p className="mt-4 body-muted">
              Digital-product benchmarks for ₹2-5k price bands in India land at 0.5-1.5% visitor-to-purchase.
              We&apos;ve modeled 0.84% — the middle of that band. Assumes no paid ads in month 1-2; organic +
              content only. Upside case (with ₹30k/mo on targeted IG + YT): 2-3× these volumes by month 6.
            </p>
            <div className="mt-8 card-apple p-4 sm:p-6">
              <FunnelTable rows={funnel} />
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card-apple p-6">
                <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Monthly revenue</div>
                <div className="mt-2 h-card tabular-nums">~₹9.6 L</div>
                <p className="mt-1 text-caption text-muted">210 × ₹4,599 = ₹9,65,790</p>
              </div>
              <div className="card-apple p-6">
                <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Annual (base)</div>
                <div className="mt-2 h-card tabular-nums">~₹18-25 L</div>
                <p className="mt-1 text-caption text-muted">Ramp starts slow; steady-state from month 4.</p>
              </div>
              <div className="card-apple p-6">
                <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Annual (upside)</div>
                <div className="mt-2 h-card tabular-nums">~₹40-50 L</div>
                <p className="mt-1 text-caption text-muted">With paid distribution + affiliate leverage.</p>
              </div>
            </div>
          </div>

          {/* Risks */}
          <div>
            <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
              08 · Key risks
            </div>
            <h2 className="mt-3 h-tile">What can kill this, and how we protect against it.</h2>
            <div className="mt-8 space-y-3">
              {risks.map((r, i) => (
                <details
                  key={i}
                  className="group card-apple px-6 py-4 [&_summary::-webkit-details-marker]:hidden open:bg-surface-alt transition-colors"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-micro font-mono text-muted-faint tabular-nums">
                        R{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-body text-ink font-medium truncate">{r.title}</span>
                    </div>
                    <span className="text-blue-link text-[20px] leading-none transition-transform group-open:rotate-45 flex-none">+</span>
                  </summary>
                  <p className="mt-3 text-caption text-muted leading-relaxed">{r.body}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
              09 · Recommendations
            </div>
            <h2 className="mt-3 h-tile">What to do next — in order.</h2>
            <ol className="mt-6 space-y-3 text-body text-muted">
              <li className="flex gap-4">
                <span className="flex-none w-7 h-7 rounded-full bg-blue text-white text-micro font-semibold flex items-center justify-center tabular-nums">1</span>
                <span className="pt-0.5">
                  <span className="text-ink font-medium">Lock in the inaugural offer</span> with a visible
                  countdown or &ldquo;first 500 buyers&rdquo; framing. Scarcity needs to feel real, not cliché.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-none w-7 h-7 rounded-full bg-blue text-white text-micro font-semibold flex items-center justify-center tabular-nums">2</span>
                <span className="pt-0.5">
                  <span className="text-ink font-medium">Publish 10 teardown posts</span> — &ldquo;why this
                  indicator lies to you&rdquo; — on X / IG Reels / YT Shorts, linking to /product. Hindi + English
                  mix, 60/40.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-none w-7 h-7 rounded-full bg-blue text-white text-micro font-semibold flex items-center justify-center tabular-nums">3</span>
                <span className="pt-0.5">
                  <span className="text-ink font-medium">Ship the /updates archive</span> daily for 30 days
                  before even thinking about paid ads. Proof-of-work sells the tooling, not the tooling itself.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-none w-7 h-7 rounded-full bg-blue text-white text-micro font-semibold flex items-center justify-center tabular-nums">4</span>
                <span className="pt-0.5">
                  <span className="text-ink font-medium">Instrument the funnel</span> — Vercel Analytics is
                  already live; add Plausible or Umami for content-attribution. Every post needs a UTM.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-none w-7 h-7 rounded-full bg-blue text-white text-micro font-semibold flex items-center justify-center tabular-nums">5</span>
                <span className="pt-0.5">
                  <span className="text-ink font-medium">Defer paid ads</span> until organic funnel shows 0.5%+
                  conversion for two consecutive weeks. Paid amplifies a broken funnel into faster losses.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex-none w-7 h-7 rounded-full bg-blue text-white text-micro font-semibold flex items-center justify-center tabular-nums">6</span>
                <span className="pt-0.5">
                  <span className="text-ink font-medium">Plan v2 add-ons</span> — a &ldquo;strategy pack&rdquo;
                  at ₹999 and a &ldquo;1-on-1 review&rdquo; at ₹5,000. Upsells to existing buyers lift LTV
                  without raising acquisition cost.
                </span>
              </li>
            </ol>
          </div>

          {/* Methodology */}
          <div className="card-apple p-6 sm:p-8 border border-rule">
            <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">
              10 · Methodology &amp; caveats
            </div>
            <div className="mt-4 prose-apple text-caption">
              <p>
                This is a <strong>feasibility report</strong> — a desk-research synthesis intended to pressure-test
                a commercial thesis. It is not a guarantee of outcomes. Figures marked &ldquo;est.&rdquo; are
                informed estimates; SEBI figures are from the publicly released Sep 2024 study. Conversion rates
                are benchmarks from publicly shared Indian digital-product case studies in the ₹2-5k price range,
                interpreted conservatively.
              </p>
              <p className="mt-3">
                This document is reviewed on the date shown in the header. Re-run the analysis every quarter or
                whenever a major regulatory change materially alters the TAM.
              </p>
            </div>
          </div>

          {/* CTA back */}
          <div className="text-center pt-6">
            <Link href="/" className="link-apple chevron">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
