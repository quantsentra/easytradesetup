import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#080C10',
          surface: '#0F1318',
          raised:  '#161B22',
        },
        border: {
          DEFAULT: 'rgba(48,54,61,0.7)',
          subtle:  'rgba(48,54,61,0.35)',
        },
        accent: {
          blue:   '#58A6FF',
          green:  '#00C853',
          purple: '#7857FF',
          red:    '#F44336',
          orange: '#FF9800',
        },
        ink: {
          DEFAULT: '#E6EDF3',
          muted:   '#8B949E',
          faint:   '#3D444D',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        xl2: '20px',
        xl3: '24px',
      },
      boxShadow: {
        card:          '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(48,54,61,0.7)',
        glow:          '0 0 32px rgba(88,166,255,0.15)',
        'glow-green':  '0 0 32px rgba(0,200,83,0.15)',
        'glow-purple': '0 0 32px rgba(120,87,255,0.15)',
        'glass':       '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'fade-up':      'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-down':    'fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'blur-in':      'blurIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'float':        'float 7s ease-in-out infinite',
        'float-slow':   'float 10s ease-in-out infinite',
        'glow-pulse':   'glowPulse 4s ease-in-out infinite',
        'shimmer':      'shimmer 2.5s linear infinite',
        'pulse-soft':   'pulseSoft 3s ease-in-out infinite',
        'slide-up':     'slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeDown: {
          '0%':   { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blurIn: {
          '0%':   { opacity: '0', filter: 'blur(10px)', transform: 'translateY(20px) scale(0.97)' },
          '100%': { opacity: '1', filter: 'blur(0px)', transform: 'translateY(0) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(88,166,255,0.12), inset 0 0 20px rgba(88,166,255,0.02)' },
          '50%':      { boxShadow: '0 0 70px rgba(88,166,255,0.28), 0 0 90px rgba(120,87,255,0.1), inset 0 0 30px rgba(88,166,255,0.06)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
