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
        'fade-up': 'fadeUp 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
