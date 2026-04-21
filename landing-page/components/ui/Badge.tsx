interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'green' | 'neutral' | 'blue' | 'red' | 'orange'
}

export default function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border tracking-widest uppercase'
  if (variant === 'gold') {
    return <span className={`${base} bg-gold-bg text-gold border-gold-border`}>{children}</span>
  }
  if (variant === 'green') {
    return <span className={`${base} bg-up/8 text-up border-up/20`}>{children}</span>
  }
  return <span className={`${base} bg-subtle text-ink-faint border-line`}>{children}</span>
}
