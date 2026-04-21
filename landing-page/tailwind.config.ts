import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // light mode base
        canvas:  '#FFFFFF',
        subtle:  '#F6F6F4',
        raised:  '#EDEDEB',
        // text
        ink: {
          DEFAULT: '#0D0D0D',
          muted:   '#6B6B6B',
          faint:   '#A3A3A3',
          // old aliases — ChartDemo etc still use these
          subtle:  '#CCCCCC',
        },
        // border
        line: {
          DEFAULT: 'rgba(0,0,0,0.08)',
          strong:  'rgba(0,0,0,0.14)',
          subtle:  'rgba(0,0,0,0.05)',
        },
        // brand accent
        gold: {
          DEFAULT: '#9A6E0A',
          hover:   '#B8830C',
          bg:      'rgba(154,110,10,0.07)',
          border:  'rgba(154,110,10,0.2)',
        },
        // data colors
        up:   '#16A34A',
        down: '#DC2626',
        // backward compat — old components
        border: {
          DEFAULT: 'rgba(0,0,0,0.08)',
          subtle:  'rgba(0,0,0,0.05)',
          strong:  'rgba(0,0,0,0.14)',
        },
        bg: {
          primary: '#FFFFFF',
          surface: '#F6F6F4',
          raised:  '#EDEDEB',
          base:    '#FFFFFF',
        },
        accent: {
          blue:   '#2563EB',
          green:  '#16A34A',
          purple: '#7C3AED',
          red:    '#DC2626',
          orange: '#D97706',
        },
        signal: {
          up:   '#16A34A',
          down: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        xl2:  '16px',
        xl3:  '20px',
      },
      boxShadow: {
        card:   '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.07)',
        hero:   '0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
        // stubs for old refs
        glass:       '0 1px 3px rgba(0,0,0,0.07)',
        glow:        'none',
        'glow-green': 'none',
        'glow-purple': 'none',
        gold:         '0 0 0 1px rgba(154,110,10,0.2)',
        'gold-strong': '0 4px 20px rgba(154,110,10,0.15)',
      },
      animation: {
        'fade-up':   'fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both',
        'fade-down': 'fadeDown 0.45s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':   'fadeIn 0.35s ease both',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        // stubs
        float:        'none',
        'float-slow': 'none',
        'glow-pulse': 'none',
        shimmer:      'none',
        'slide-up':   'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'blur-in':    'fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%':   { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
