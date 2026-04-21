import SectionHeader from "@/components/ui/SectionHeader";

const signals = [
  "You're tired of indicator clutter.",
  "You don't want to depend on someone else's signals.",
  "You want a cleaner, more structured way to read price.",
  "You use TradingView and want a practical system — not theory.",
];

export default function WhoFor() {
  return (
    <section className="bg-page">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <SectionHeader
          eyebrow="Who this is for"
          title={<>This is for you if&hellip;</>}
        />

        <ul className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
          {signals.map((s) => (
            <li
              key={s}
              className="card-white p-5 sm:p-6 flex items-start gap-3 text-body text-ink leading-relaxed"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="mt-[3px] flex-none"
                aria-hidden
              >
                <circle cx="12" cy="12" r="10" fill="#0071e3" />
                <path
                  d="M8 12l3 3 5-6"
                  stroke="#fff"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
