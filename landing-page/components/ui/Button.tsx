interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variants = {
  primary:   'bg-[#0D0D0D] text-white font-bold hover:bg-[#2A2A2A]',
  secondary: 'bg-transparent text-ink border border-line-strong hover:border-[rgba(0,0,0,0.28)] hover:bg-[rgba(0,0,0,0.02)]',
  ghost:     'text-ink-muted hover:text-ink',
}

const sizes = {
  sm: 'px-4 py-2 text-[13px] rounded-lg',
  md: 'px-5 py-2.5 text-[14px] rounded-[10px]',
  lg: 'px-7 py-3.5 text-[15px] rounded-xl',
}

export default function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer select-none tracking-tight ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
