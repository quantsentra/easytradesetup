const tiers = [
  {
    name: 'Basic',
    price: '₹999',
    usd: '$12',
    popular: false,
    features: [
      '1 Strategy (ETS Momentum Setup)',
      '1 Pine Script (TradingView v5)',
      'PDF Strategy Guide (18+ pages)',
      'Quick-Start Checklist',
      'Installation Guide',
    ],
    cta: 'Buy Basic',
    href: 'GUMROAD_BASIC_URL',
    style: 'border-border',
    ctaStyle: 'secondary' as const,
  },
  {
    name: 'Pro',
    price: '₹1,999',
    usd: '$24',
    popular: true,
    features: [
      '2 Strategies',
      '2 Pine Scripts',
      'PDF Strategy Guides',
      'Trade Journal Template',
      'Risk Calculator (Excel)',
    ],
    cta: 'Buy Pro',
    href: 'GUMROAD_PRO_URL',
    style: 'border-glow',
    ctaStyle: 'primary' as const,
  },
  {
    name: 'Expert',
    price: '₹3,999',
    usd: '$48',
    popular: false,
    features: [
      '5 Strategies',
      '5 Pine Scripts',
      'Master Strategy Playbook',
      '30 Live Trade Examples',
      'Lifetime Updates',
    ],
    cta: 'Buy Expert',
    href: 'GUMROAD_EXPERT_URL',
    style: 'border-border',
    ctaStyle: 'secondary' as const,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-bg-surface/40 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Choose Your Pack</h2>
          <p className="mt-3 text-ink-muted">One-time payment. Instant delivery. No subscription ever.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 items-stretch">
          {tiers.map(({ name, price, usd, popular, features, cta, href, style, ctaStyle }) => (
            <div
              key={name}
              className={`relative rounded-card border p-6 flex flex-col bg-bg-surface ${style} ${
                popular ? 'shadow-glow' : ''
              } transition-all duration-300 hover:-translate-y-1`}
            >
              {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-accent-blue text-black text-xs font-bold">
                    ★ Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">{name}</div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-ink">{price}</span>
                  <span className="text-ink-faint text-sm mb-1">/ {usd}</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="text-accent-green mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-ink-muted">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-center py-3 px-6 rounded-xl font-bold text-sm transition-all duration-200 ${
                  ctaStyle === 'primary'
                    ? 'bg-accent-green text-black hover:bg-accent-green/90 shadow-glow-green'
                    : 'bg-bg-raised border border-border text-ink hover:border-accent-blue/40'
                }`}
              >
                {cta} →
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-ink-faint">
          Secure checkout via Gumroad · Instant download link via email
        </p>
      </div>
    </section>
  )
}
