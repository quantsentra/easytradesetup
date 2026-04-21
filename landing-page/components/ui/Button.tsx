interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variants = {
  primary:   'bg-gold text-black font-bold hover:bg-gold-light',
  secondary: 'bg-transparent text-ink border border-[rgba(255,255,255,0.11)] hover:border-[rgba(255,255,255,0.22)] hover:bg-bg-raised',
  ghost:     'text-ink-muted hover:text-ink',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-7 py-3.5 text-base rounded-xl',
}

export default function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer select-none tracking-tight ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
