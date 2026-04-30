import Link from "next/link";
import Price from "@/components/ui/Price";
import HeroSlider from "@/components/ui/HeroSlider";
import { OFFER_LABEL } from "@/lib/pricing";
import { resolveHomeMarket } from "@/lib/geo";
// Note: hero CTA hides price on mobile per CRO request — full label only on sm+.

export default async function Hero() {
  const homeMarket = await resolveHomeMarket();
  return (
    <section className="relative above-bg overflow-hidden">
      <div className="grain" aria-hidden />

      <div className="container-wide relative pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20">
        {/* MOBILE-ONLY headline block — appears before the chart so users see
            the value prop, then the visual proof, then the conversion stack. */}
        <div className="lg:hidden">
          <Eyebrow />
          <Headline className="mt-4 text-[34px] sm:text-[44px]" />
        </div>

        {/* Main two-column grid. On mobile it stacks chart first, copy second. */}
        <div className="mt-6 lg:mt-0 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-center">
          {/* HERO SLIDER — 3-screen rotating live ticker (NIFTY/Gold/US30).
              order-1 on mobile (right after H1), order-2 on lg. */}
          <div className="order-1 lg:order-2 relative lg:scale-[1.04] xl:scale-[1.08] origin-left">
            <HeroSlider homeMarket={homeMarket} />
          </div>

          {/* COPY — order-2 on mobile (after chart), order-1 on lg */}
          <div className="order-2 lg:order-1 max-w-[620px]">
            {/* Eyebrow + H1 only render here on lg; mobile already showed them above. */}
            <div className="hidden lg:block">
              <Eyebrow />
              <Headline className="mt-5 text-[58px]" />
            </div>

            <p className="mt-2 lg:mt-5 max-w-[520px] text-[15px] sm:text-[16px] leading-[1.55] text-ink-60">
              Golden Indicator combines market structure, trend regime, key levels, supply /
              demand zones, pullback context, and a risk framework into one Pine v5 indicator.
              Bar-close logic. No signal service. You decide every trade.
            </p>

            <div className="mt-6 lg:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/checkout" className="btn btn-primary btn-lg w-full sm:w-auto justify-center">
                <span className="sm:hidden">Buy Golden Indicator</span>
                <span className="hidden sm:inline">
                  Buy · <Price variant="amount" />
                </span>
                <span className="arrow" aria-hidden>→</span>
              </Link>
              <Link
                href="/sample"
                className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-[14px] font-medium text-ink-60 hover:text-ink transition-colors px-2 py-2"
              >
                View free sample <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Stats — 3-up grid on mobile, inline with dividers on sm+ */}
            <div className="mt-7 sm:mt-8 grid grid-cols-3 sm:flex sm:flex-wrap sm:items-center gap-3 sm:gap-6">
              <Stat num="6" label="Bundle items" />
              <Divider />
              <Stat num="24/5" label="Markets" />
              <Divider />
              <Stat num="0" label="Subscriptions" color="acid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Eyebrow() {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{
        background: "rgba(143, 204, 42, 0.10)",
        border: "1px solid rgba(143, 204, 42, 0.35)",
      }}
    >
      <span className="pulse-dot" aria-hidden />
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-acid">
        v2.4 · {OFFER_LABEL} live
      </span>
    </div>
  );
}

function Headline({ className = "" }: { className?: string }) {
  return (
    <h1
      className={`font-display font-semibold leading-[1.04] tracking-[-0.03em] text-ink ${className}`}
    >
      Golden Indicator — one TradingView indicator
      <br className="hidden sm:inline" />{" "}
      to read the market with{" "}
      <span
        className="word-rotator"
        aria-label="structure, clarity, discipline, confidence"
      >
        <span className="word" style={{ "--word-i": 0 } as React.CSSProperties}>
          structure
        </span>
        <span className="word" style={{ "--word-i": 1 } as React.CSSProperties}>
          clarity
        </span>
        <span className="word" style={{ "--word-i": 2 } as React.CSSProperties}>
          discipline
        </span>
        <span className="word" style={{ "--word-i": 3 } as React.CSSProperties}>
          confidence
        </span>
        <svg viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden>
          <path
            d="M2 8 Q 100 2, 200 7 T 398 6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </span>{" "}
      — not noise.
    </h1>
  );
}

function Stat({ num, label, color }: { num: string; label: string; color?: "acid" }) {
  return (
    <div>
      <div
        className="stat-num text-[22px] sm:text-[24px]"
        style={{ color: color === "acid" ? "#8FCC2A" : "var(--c-ink)" }}
      >
        {num}
      </div>
      <div className="mt-1 font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-widest text-ink-40">
        {label}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="hidden sm:block h-8 w-px bg-rule-2" aria-hidden />;
}

