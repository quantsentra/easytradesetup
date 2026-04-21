import FadeIn from '../ui/FadeIn'

const testimonials = [
  {
    initials: 'RM',
    name: 'Rajan M.',
    location: 'Pune · Software Engineer',
    quote: "Tried 3 paid courses before this — none gave me actual entry rules. This PDF has exactly what to check before pressing buy. Setup took 8 minutes on a free TradingView account.",
  },
  {
    initials: 'DS',
    name: 'Deepa S.',
    location: 'Chennai · Business Owner',
    quote: "The pre-trade checklist is what I use every morning. Takes 45 seconds and stops me from taking impulsive trades. Already saved me from two bad entries this week alone.",
  },
  {
    initials: 'VT',
    name: 'Vikram T.',
    location: 'Delhi · Salaried Professional',
    quote: "Was skeptical at first — feels too simple. But the 3-confirmation logic is solid. Haven't touched another indicator since. Consistent process for the first time in 2 years.",
  },
]

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#9A6E0A">
          <path d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.6 3.4 8.9l.5-2.9-2.1-2 2.9-.4L6 1z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-32 border-t border-line bg-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">

        <FadeIn className="mb-14">
          <span className="label">Testimonials</span>
          <h2 className="mt-3 text-3xl sm:text-[40px] font-black tracking-[-0.03em] text-ink">What Traders Are Saying</h2>
          <p className="mt-2 text-[15px] text-ink-muted">Real feedback. No paid reviews. No profit claims.</p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map(({ initials, name, location, quote }, i) => (
            <FadeIn key={name} delay={0.06 * i}>
              <div className="card card-hover p-6 flex flex-col gap-5 h-full">
                <Stars />
                <p className="text-[14px] text-ink-muted leading-[1.75] flex-1">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-line">
                  <div className="w-8 h-8 rounded-full bg-subtle border border-line flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-ink-muted">{initials}</span>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-ink">{name}</div>
                    <div className="text-[11px] font-mono text-ink-faint">{location}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.22} className="mt-8 text-center">
          <p className="text-[11px] font-mono text-ink-faint">
            Reviews reflect individual experiences. Trading results depend on market conditions and personal discipline.
          </p>
        </FadeIn>

      </div>
    </section>
  )
}
