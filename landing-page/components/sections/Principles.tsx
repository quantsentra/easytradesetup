import SectionHeader from "@/components/ui/SectionHeader";

const principles = [
  {
    n: "01",
    title: "No signals",
    body: "Blindly following signals loses money. We hand you a chart tool, not a leash.",
  },
  {
    n: "02",
    title: "No subscriptions",
    body: "You own what you buy. Forever. No auto-renewals. No tiered plans. No silent drain on your account.",
  },
  {
    n: "03",
    title: "No fake performance claims",
    body: "Markets change. We teach you how to read them — not swallow yesterday's win rate as tomorrow's promise.",
  },
];

export default function Principles() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <SectionHeader
          eyebrow="How we operate"
          title={<>We don&apos;t sell <span className="grad-text-2">shortcuts.</span></>}
          lede="In a category full of hype, pump groups, and recurring fees, here is what EasyTradeSetup will never ship."
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {principles.map((p) => (
            <div key={p.n} className="glass-card-soft p-6 sm:p-8 flex flex-col">
              <div className="eye">
                <span className="eye-dot" aria-hidden />
                {p.n}
              </div>
              <h3 className="mt-4 h-card">{p.title}</h3>
              <p className="mt-3 text-caption text-ink-60 leading-relaxed flex-1">{p.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 sm:mt-10 text-center text-nano font-mono uppercase tracking-widest text-ink-40 max-w-2xl mx-auto">
          Customer testimonials will be published here post-launch, with written permission and verifiable purchase records.
        </p>
      </div>
    </section>
  );
}
