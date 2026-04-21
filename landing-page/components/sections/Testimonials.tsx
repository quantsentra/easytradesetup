import FadeIn from '../ui/FadeIn'

const testimonials = [
  {
    initials: 'RM',
    name: 'Rajan M.',
    location: 'Pune · Software Engineer',
    quote: "Tried 3 paid courses before this — none gave me actual entry rules. This PDF has exactly what to check before pressing buy. Setup took 8 minutes on a free TradingView account.",
    rating: 5,
    color: 'accent-blue',
  },
  {
    initials: 'DS',
    name: 'Deepa S.',
    location: 'Chennai · Business Owner',
    quote: "The pre-trade checklist is what I use every morning. Takes 45 seconds and stops me from taking impulsive trades. Already saved me from two bad entries this week alone.",
    rating: 5,
    color: 'accent-green',
  },
  {
    initials: 'VT',
    name: 'Vikram T.',
    location: 'Delhi · Salaried Professional',
    quote: "Was skeptical at first — feels too simple. But the 3-confirmation logic is actually solid. Haven't touched another indicator since. Consistent process for the first time in 2 years.",
    rating: 5,
    color: 'accent-purple',
  },
]

const colorMap: Record<string, { avatar: string; ring: string; dot: string }> = {
  'accent-blue':   { avatar: 'bg-accent-blue/15 border-accent-blue/25 text-accent-blue',   ring: 'group-hover:border-accent-blue/50 group-hover:bg-accent-blue/25',   dot: 'bg-accent-blue' },
  'accent-green':  { avatar: 'bg-accent-green/15 border-accent-green/25 text-accent-green', ring: 'group-hover:border-accent-green/50 group-hover:bg-accent-green/25',  dot: 'bg-accent-green' },
  'accent-purple': { avatar: 'bg-accent-purple/15 border-accent-purple/25 text-accent-purple', ring: 'group-hover:border-accent-purple/50 group-hover:bg-accent-purple/25', dot: 'bg-accent-purple' },
}

export default function Testimonials() {
  return (
    <section className="py-14 sm:py-24 border-b border-border relative overflow-hidden">
      <div className="absolute inset-0 aurora-blue opacity-40 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-accent-blue/70 mb-3">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">What Traders Are Saying</h2>
          <p className="mt-3 text-ink-muted">Real feedback. No paid reviews. No profit claims.</p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map(({ initials, name, location, quote, rating, color }, i) => {
            const c = colorMap[color]
            return (
              <FadeIn key={name} delay={0.08 + i * 0.1}>
                <div className="glass rounded-xl p-6 flex flex-col gap-4 h-full
                  hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30
                  transition-all duration-300 group cursor-default relative overflow-hidden">

                  {/* Decorative quote mark */}
                  <div className="absolute top-4 right-5 text-6xl font-black text-white/[0.03] leading-none select-none">&ldquo;</div>

                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 text-xs font-black
                      transition-all duration-300 group-hover:scale-110 ${c.avatar} ${c.ring}`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-ink">{name}</div>
                      <div className="text-[11px] text-ink-faint truncate">{location}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: rating }).map((_, j) => (
                      <svg key={j} width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B">
                        <path d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.6 3.4 8.9l.5-2.9-2.1-2 2.9-.4L6 1z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-sm text-ink-muted leading-relaxed flex-1 relative z-10">
                    &ldquo;{quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                    <span className="text-[10px] font-semibold text-ink-faint uppercase tracking-widest">Golden Indicator</span>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>

        <FadeIn delay={0.42} className="mt-8 text-center">
          <p className="text-[11px] text-ink-faint">
            Reviews reflect individual experiences. Trading results depend on market conditions and personal discipline.
            EasyTradeSetup does not guarantee profitability.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
