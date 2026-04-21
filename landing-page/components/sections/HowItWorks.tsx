import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  { n: "01", title: "Buy once", body: "Single one-time payment of ₹2,499. No subscription, no recurring charges, no feature tiers." },
  { n: "02", title: "Receive instantly", body: "Pine script, trade-logic PDF, and risk calculator delivered to your inbox in seconds." },
  { n: "03", title: "Paste into TradingView", body: "Open Pine Editor, paste the script, save, and add to any chart. Any symbol, any timeframe." },
];

export default function HowItWorks() {
  return (
    <section className="bg-page">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <SectionHeader
          eyebrow="How it works"
          title={<>Three steps. Under a minute.</>}
        />

        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {steps.map((s) => (
            <div key={s.n} className="card-white p-6 sm:p-8 md:p-10">
              <div className="text-micro font-semibold text-blue-link tracking-wider">{s.n}</div>
              <h3 className="mt-3 sm:mt-4 h-tile">{s.title}</h3>
              <p className="mt-3 text-caption text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
