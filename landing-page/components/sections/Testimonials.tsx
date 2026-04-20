import FadeIn from '../ui/FadeIn'

const testimonials = [
  {
    initials: 'RM',
    name: 'Rajan M.',
    location: 'Pune · Software Engineer',
    quote:
      'Tried 3 paid courses before this — none gave me actual entry rules. This PDF has exactly what to check before pressing buy. That\'s all I needed. Setup took 8 minutes on a free TradingView account.',
    rating: 5,
    tier: 'Basic Pack',
  },
  {
    initials: 'DS',
    name: 'Deepa S.',
    location: 'Chennai · Business Owner',
    quote:
      'The pre-trade checklist is what I use every morning. Takes 45 seconds and stops me from taking impulsive trades. Already saved me from two bad entries this week alone.',
    rating: 5,
    tier: 'Pro Pack',
  },
  {
    initials: 'VT',
    name: 'Vikram T.',
    location: 'Delhi · Salaried Professional',
    quote:
      'Was skeptical at ₹999 — feels too cheap. But the 3-confirmation logic is actually solid. Haven\'t touched another indicator since. Consistent process for the first time in 2 years of trading.',
    rating: 5,
    tier: 'Pro Pack',
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 12 12"
          fill={i < count ? '#F59E0B' : 'none'}
          className={i < count ? 'text-amber-400' : 'text-ink-faint'}
        >
          <path
            d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.6 3.4 8.9l.5-2.9-2.1-2 2.9-.4L6 1z"
            stroke="currentColor"
            strokeWidth={i < count ? '0' : '1'}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-14 sm:py-24 border-b border-border bg-bg-surface/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">What Traders Are Saying</h2>
          <p className="mt-3 text-ink-muted">Real feedback. No paid reviews. No profit claims.</p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map(({ initials, name, location, quote, rating, tier }, i) => (
            <FadeIn key={name} delay={0.1 + i * 0.12}>
              <div className="bg-bg-surface border border-border rounded-card p-6 flex flex-col gap-4 hover:border-border/80 hover:-translate-y-0.5 transition-all duration-300 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-blue/15 border border-accent-blue/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-blue text-xs font-black">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink">{name}</div>
                    <div className="text-[11px] text-ink-faint truncate">{location}</div>
                  </div>
                </div>

                <StarRating count={rating} />

                <p className="text-sm text-ink-muted leading-relaxed flex-1">
                  &ldquo;{quote}&rdquo;
                </p>

                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  <span className="text-[10px] font-semibold text-ink-faint uppercase tracking-widest">{tier}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.45} className="mt-8 text-center">
          <p className="text-[11px] text-ink-faint">
            Reviews reflect individual experiences. Trading results depend on market conditions and personal discipline.
            EasyTradeSetup does not guarantee profitability.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
