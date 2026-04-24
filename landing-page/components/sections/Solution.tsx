import SectionHeader from "@/components/ui/SectionHeader";

export default function Solution() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <SectionHeader
          eyebrow="The solution"
          title={
            <>
              Structure, levels, regime, and risk —{" "}
              <span className="grad-text-2">in one TradingView indicator.</span>
            </>
          }
          lede="Golden Indicator is designed to help you read the market before you react to it. A cleaner way to study price action, identify important zones, and make decisions based on structure instead of emotion."
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 max-w-[960px] mx-auto">
          <Pillar
            title="No Telegram calls"
            desc="No signal service. No copy-trading. No alerts pushing you into trades you didn't choose."
          />
          <Pillar
            title="No accuracy hype"
            desc="No win-rate numbers from a curated screenshot library. Every trade is your call, on your chart."
          />
          <Pillar
            title="No subscription"
            desc="One payment, lifetime access. Future updates included. No tier upsells, no feature gating."
          />
        </div>

        <p className="mt-10 text-center text-nano font-mono uppercase tracking-widest text-ink-40">
          One practical TradingView tool · Built for serious retail traders
        </p>
      </div>
    </section>
  );
}

function Pillar({ title, desc }: { title: string; desc: string }) {
  return (
    <article className="glass-card-soft p-6 sm:p-7">
      <h3 className="h-card">{title}</h3>
      <p className="mt-3 text-caption text-ink-60 leading-relaxed">{desc}</p>
    </article>
  );
}
