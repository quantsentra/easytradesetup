import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    n: "01",
    title: "Reserve today",
    body: "Pay once at the launch price. No subscriptions. No upsells. No card on file.",
  },
  {
    n: "02",
    title: "Receive on launch day",
    body: "Pine file, Trade Logic PDF, risk calculator, and first market note — delivered by email.",
  },
  {
    n: "03",
    title: "Paste. Save. Trade.",
    body: "Open TradingView, paste the script, hit save. Works on any chart, any market, any plan — including free.",
  },
];

export default function HowItWorks() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <SectionHeader
          eyebrow="How it works"
          title={<>From checkout to chart in <span className="grad-text-2">under 60 seconds.</span></>}
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="glass-card-soft p-6 sm:p-8 md:p-10 flex flex-col transition-all duration-200 hover:border-rule-3 hover:-translate-y-0.5"
            >
              <div className="font-mono text-nano uppercase tracking-widest text-cyan">
                {s.n}
              </div>
              <h3 className="mt-3 sm:mt-4 h-tile">{s.title}</h3>
              <p className="mt-3 text-caption text-ink-60 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
