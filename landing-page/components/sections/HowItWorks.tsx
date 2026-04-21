import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    n: "01",
    title: "Buy once",
    body: "No subscriptions. No upsells. A single one-time payment and the product is yours.",
  },
  {
    n: "02",
    title: "Download instantly",
    body: "Indicator, guide, risk calculator, and market notes — all delivered straight to your inbox.",
  },
  {
    n: "03",
    title: "Apply and trade",
    body: "Works on any chart. Any market. Immediately. Paste the script, save, and read price with clarity.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-page">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <SectionHeader
          eyebrow="How it works"
          title={<>Start in less than 60 seconds.</>}
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
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
