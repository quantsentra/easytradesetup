interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'red' | 'orange'
}

const variantMap = {
  blue:   'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  green:  'bg-accent-green/10 text-accent-green border-accent-green/20',
  red:    'bg-accent-red/10 text-accent-red border-accent-red/20',
  orange: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
}

export default function Badge({ children, variant = 'blue' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border tracking-wide ${variantMap[variant]}`}>
      {children}
    </span>
  )
}
