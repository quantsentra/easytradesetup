import Link from "next/link";

export default function SampleLeadMagnet() {
  return (
    <section className="above-bg">
      <div className="container-x py-10 sm:py-14">
        <div
          className="relative overflow-hidden rounded-[24px] p-6 sm:p-10 md:p-12"
          style={{
            background:
              "linear-gradient(135deg, rgba(43,123,255,0.14), rgba(34,211,238,0.10) 55%, rgba(240,192,90,0.10))",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-10 h-64 w-64 rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(circle, rgba(43,123,255,0.45), transparent 70%)" }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
            <div>
              <div className="eye">
                <span className="eye-dot" aria-hidden />
                Free sample · no signup
              </div>
              <h3 className="mt-3 h-card max-w-2xl">
                Judge the quality before you reserve.
              </h3>
              <p className="mt-3 text-caption text-ink-60 leading-relaxed max-w-2xl">
                One complete setup from the 50-page Trade Logic PDF — entry rules, exit rules,
                invalidation, risk framework. No email required, no drip sequence. Same format as the full book.
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-nano font-mono uppercase tracking-widest text-ink-40">
                <li>Chapter 4 · ORB NIFTY</li>
                <li>Real numbers · real rules</li>
                <li>~5-minute read</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:gap-2 md:text-right">
              <Link href="/sample" className="btn btn-primary">
                Read sample chapter
              </Link>
              <Link href="/case-studies" className="btn btn-ghost">
                Or see case studies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
