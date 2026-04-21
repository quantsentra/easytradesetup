import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    n: "01",
    title: "Buy once",
    body: "Single one-time payment of ₹2,499. No subscription, no recurring charges, no feature tiers.",
  },
  {
    n: "02",
    title: "Receive instantly",
    body: "Pine script, trade-logic PDF, and risk calculator delivered to your inbox within seconds.",
  },
  {
    n: "03",
    title: "Paste into TradingView",
    body: "Open Pine Editor, paste the script, save, and add to any chart. Works on any symbol, any timeframe.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 md:py-32 border-y border-ink-border bg-ink-soft/30">
      <div className="container-x">
        <SectionHeader
          kicker="How it works"
          title={<>Three steps. <span className="italic text-gold">Under a minute.</span></>}
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-ink-border rounded-2xl overflow-hidden border border-ink-border">
          {steps.map((s) => (
            <div key={s.n} className="bg-ink-soft p-8 md:p-10">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-gold">{s.n}</span>
                <span className="h-px flex-1 bg-ink-border" />
              </div>
              <h3 className="mt-6 font-display text-3xl">{s.title}</h3>
              <p className="mt-3 text-cream-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
