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
          primary: '#0D1117',
          surface: '#161B22',
          raised:  '#1C2128',
        },
        border: {
          DEFAULT: 'rgba(48,54,61,0.8)',
          subtle:  'rgba(48,54,61,0.4)',
        },
        accent: {
          blue:   '#58A6FF',
          green:  '#00C853',
          red:    '#F44336',
          orange: '#FF9800',
        },
        ink: {
          DEFAULT: '#E6EDF3',
          muted:   '#8B949E',
          faint:   '#484F58',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        xl2: '24px',
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(48,54,61,0.8)',
        glow:  '0 0 24px rgba(88,166,255,0.12)',
        'glow-green': '0 0 24px rgba(0,200,83,0.12)',
      },
      animation: {
        'fade-up':    'fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-down':  'fadeDown 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        'float':      'float 7s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeDown: {
          '0%':   { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 24px rgba(88,166,255,0.1), inset 0 0 24px rgba(88,166,255,0.02)' },
          '50%':      { boxShadow: '0 0 60px rgba(88,166,255,0.25), 0 0 80px rgba(0,200,83,0.08), inset 0 0 32px rgba(88,166,255,0.06)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
      },
    },
  },
  plugins: [],
}

export default config
