interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variants = {
  primary:   'bg-accent-green text-black font-bold hover:bg-accent-green/90 shadow-glow-green',
  secondary: 'bg-bg-surface text-ink border border-border hover:border-accent-blue/40 hover:bg-bg-raised',
  ghost:     'text-ink-muted hover:text-ink hover:bg-bg-surface',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
}

export default function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer select-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
