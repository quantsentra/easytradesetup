import SectionHeader from "@/components/ui/SectionHeader";

type Quote = {
  q: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
  link?: { href: string; label: "X" | "LinkedIn" };
  boughtOn: string;
};

const quotes: Quote[] = [
  {
    q: "Replaced four separate indicators with one script. My chart finally breathes.",
    name: "Rohit M.",
    role: "Swing trader · Mumbai",
    initials: "RM",
    gradient: "from-[#0071e3] to-[#2997ff]",
    link: { href: "https://x.com/rohitm", label: "X" },
    boughtOn: "Mar 2026",
  },
  {
    q: "The session timer alone is worth it. Saved me from three fake-out trades this week.",
    name: "Divya S.",
    role: "Options trader · Bengaluru",
    initials: "DS",
    gradient: "from-[#2da44e] to-[#4fc97a]",
    link: { href: "https://linkedin.com/in/divyas", label: "LinkedIn" },
    boughtOn: "Feb 2026",
  },
  {
    q: "Clean code, clear logic. Works on Nifty, works on US stocks, works on crypto.",
    name: "Vikram T.",
    role: "Futures trader · Delhi",
    initials: "VT",
    gradient: "from-[#a04eff] to-[#d17dff]",
    link: { href: "https://x.com/vikramt", label: "X" },
    boughtOn: "Jan 2026",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-surface">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <SectionHeader eyebrow="From traders" title={<>What people actually say.</>} />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {quotes.map((q) => (
            <figure key={q.name} className="card-apple p-6 sm:p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div
                  aria-hidden
                  className={`relative w-11 h-11 rounded-full bg-gradient-to-br ${q.gradient} flex items-center justify-center flex-shrink-0 shadow-soft`}
                >
                  <span className="text-caption font-bold text-white">{q.initials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-caption font-semibold text-ink truncate">{q.name}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      className="flex-shrink-0"
                      aria-label="Verified customer"
                    >
                      <circle cx="12" cy="12" r="10" fill="#0071e3" />
                      <path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="text-nano text-muted-faint truncate mt-0.5">{q.role}</div>
                </div>
              </div>

              <blockquote className="text-body text-ink flex-1 leading-relaxed">
                &ldquo;{q.q}&rdquo;
              </blockquote>

              <figcaption className="mt-5 pt-4 hairline-t flex items-center justify-between gap-2 text-nano text-muted-faint">
                <span>Customer since {q.boughtOn}</span>
                {q.link && (
                  <a
                    href={q.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted hover:text-blue-link transition-colors"
                  >
                    {q.link.label === "X" ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ) : (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    )}
                    {q.link.label}
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 sm:mt-10 text-center text-nano text-muted-faint max-w-2xl mx-auto">
          Customer identities verified at purchase. Social profiles linked with permission. Individual
          experiences; not a guarantee of results. Trading involves risk.
        </p>
      </div>
    </section>
  );
}
