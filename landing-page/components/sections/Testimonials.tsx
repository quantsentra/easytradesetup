import SectionHeader from "@/components/ui/SectionHeader";

const principles = [
  {
    n: "01",
    title: "No signals. Ever.",
    body: "We don't send buy/sell calls. The chart tells you. You decide. No Telegram ping telling you to go long at 2:47 PM.",
  },
  {
    n: "02",
    title: "No subscriptions.",
    body: "One-time ₹2,499. Lifetime access. No auto-renewal, no tiered plans, no upsells after purchase.",
  },
  {
    n: "03",
    title: "No performance promises.",
    body: "Trading involves real risk of loss. Golden Indicator is a chart tool, not a money printer. We won't tell you otherwise.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-surface">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <SectionHeader
          eyebrow="What we stand for"
          title={<>Three things we refuse to do.</>}
          lede="In a category full of hype, pump groups, and recurring fees — here is what EasyTradeSetup will never ship."
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {principles.map((p) => (
            <div key={p.n} className="card-apple p-6 sm:p-8 md:p-10 flex flex-col">
              <div className="text-micro font-semibold text-blue-link tracking-wider">{p.n}</div>
              <h3 className="mt-3 sm:mt-4 h-tile">{p.title}</h3>
              <p className="mt-3 text-caption text-muted leading-relaxed flex-1">{p.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 sm:mt-10 text-center text-nano text-muted-faint max-w-2xl mx-auto">
          Customer testimonials will be published here post-launch, with explicit written permission and
          clearly dated purchase records. Until then — no fabricated quotes.
        </p>
      </div>
    </section>
  );
}
