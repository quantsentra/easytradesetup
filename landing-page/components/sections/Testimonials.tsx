import SectionHeader from "@/components/ui/SectionHeader";

const quotes = [
  {
    q: "Replaced four separate indicators with this one script. My chart finally breathes.",
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
    <section className="container-x py-24 md:py-32">
      <SectionHeader kicker="From traders" title={<>What people <span className="italic text-gold">actually</span> say.</>} />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
        {quotes.map((q, i) => (
          <figure key={i} className="glass-card p-8 flex flex-col">
            <span className="font-display text-6xl leading-none text-gold/40">&ldquo;</span>
            <blockquote className="mt-2 text-lg text-cream leading-relaxed flex-1">{q.q}</blockquote>
            <figcaption className="mt-6 pt-6 border-t border-ink-border">
              <div className="font-medium">{q.a}</div>
              <div className="text-xs font-mono text-cream-dim mt-1">{q.r}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
