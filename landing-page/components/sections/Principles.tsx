import SectionHeader from "@/components/ui/SectionHeader";

const principles = [
  {
    n: "01",
    title: "No signals",
    body: "Because blindly following signals loses money. We hand you a chart tool, not a leash.",
  },
  {
    n: "02",
    title: "No subscriptions",
    body: "You own what you buy. Forever. No auto-renewals. No tiered plans. No silent drain on your account.",
  },
  {
    n: "03",
    title: "No fake performance claims",
    body: "Markets change. We teach you how to read them — not how to swallow yesterday's win rate as tomorrow's promise.",
  },
];

export default function Principles() {
  return (
    <section className="bg-surface">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <SectionHeader
          eyebrow="How we operate"
          title={<>We don&apos;t sell shortcuts.</>}
          lede="In a category full of hype, pump groups, and recurring fees, here is what EasyTradeSetup will never ship."
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
          Customer testimonials will be published here post-launch, with written permission and verifiable purchase records.
        </p>
      </div>
    </section>
  );
}
