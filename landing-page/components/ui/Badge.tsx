interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'red' | 'orange' | 'gold' | 'neutral'
}

export default function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border tracking-widest uppercase'
  if (variant === 'gold') {
    return <span className={`${base} bg-gold-faint text-gold border-gold/20`}>{children}</span>
  }
  if (variant === 'green') {
    return <span className={`${base} bg-signal-up/10 text-signal-up border-signal-up/20`}>{children}</span>
  }
  return <span className={`${base} bg-bg-raised text-ink-muted border-[rgba(255,255,255,0.07)]`}>{children}</span>
}
