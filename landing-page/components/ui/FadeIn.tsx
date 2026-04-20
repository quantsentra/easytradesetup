'use client'
import { useEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export default function FadeIn({ children, className = '', delay = 0, direction = 'up' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { rootMargin: '-80px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const offsets: Record<string, string> = {
    up:    'translateY(24px)',
    down:  'translateY(-24px)',
    left:  'translateX(24px)',
    right: 'translateX(-24px)',
    none:  'none',
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : offsets[direction],
        transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
