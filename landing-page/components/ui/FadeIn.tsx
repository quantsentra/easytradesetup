'use client'
import { useEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  scale?: boolean
  blur?: boolean
}

const offsets: Record<string, string> = {
  up:    'translateY(28px)',
  down:  'translateY(-20px)',
  left:  'translateX(28px)',
  right: 'translateX(-28px)',
  none:  'translateY(0)',
}

export default function FadeIn({
  children, className = '', delay = 0, direction = 'up', scale = true, blur = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { rootMargin: '-50px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : `${offsets[direction]}${scale ? ' scale(0.97)' : ''}`,
        filter: blur ? (visible ? 'blur(0px)' : 'blur(6px)') : undefined,
        transition: [
          `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
          `transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
          blur ? `filter 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s` : '',
        ].filter(Boolean).join(', '),
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
