import SectionHeader from "@/components/ui/SectionHeader";

const quotes = [
  {
    q: "Replaced four separate indicators with one script. My chart finally breathes.",
    a: "Rohit M.",
    r: "Swing trader · Mumbai",
  },
  {
    q: "The session timer alone is worth it. Saved me from three fake-out trades this week.",
    a: "Divya S.",
    r: "Options trader · Bengaluru",
  },
  {
    q: "Clean code, clear logic. Works on Nifty, works on US stocks, works on crypto.",
    a: "Vikram T.",
    r: "Futures trader · Delhi",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-surface">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <SectionHeader eyebrow="From traders" title={<>What people actually say.</>} />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {quotes.map((q, i) => (
            <figure key={i} className="card-apple p-6 sm:p-8 flex flex-col">
              <blockquote className="h-card flex-1">&ldquo;{q.q}&rdquo;</blockquote>
              <figcaption className="mt-5 sm:mt-6 pt-5 sm:pt-6 hairline-t">
                <div className="text-body text-ink font-medium">{q.a}</div>
                <div className="text-caption text-muted-faint mt-0.5">{q.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
