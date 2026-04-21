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
          base:    '#080808',
          surface: '#0F0F0F',
          raised:  '#181818',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          strong:  'rgba(255,255,255,0.11)',
          // keep old aliases so unchanged components don't break
          subtle:  'rgba(255,255,255,0.04)',
        },
        gold: {
          DEFAULT: '#C8A84B',
          light:   '#E0BF6A',
          dim:     'rgba(200,168,75,0.12)',
          faint:   'rgba(200,168,75,0.06)',
        },
        signal: {
          up:   '#22C55E',
          down: '#EF4444',
        },
        ink: {
          DEFAULT: '#ECECEC',
          muted:   '#888888',
          faint:   '#484848',
          // old alias
          subtle:  '#333333',
        },
        // keep old accent tokens so existing dynamic components (ChartDemo etc.) don't break
        accent: {
          blue:   '#888888',
          green:  '#22C55E',
          purple: '#888888',
          red:    '#EF4444',
          orange: '#D97706',
        },
        // keep old bg aliases
        'bg-primary':  '#080808',
        'bg-surface':  '#0F0F0F',
        'bg-raised':   '#181818',
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
        card:   '0 1px 3px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
        gold:   '0 0 24px rgba(200,168,75,0.12)',
        'gold-strong': '0 0 40px rgba(200,168,75,0.18)',
        // keep old aliases
        glass:  '0 4px 16px rgba(0,0,0,0.5)',
        glow:            '0 0 0 transparent',
        'glow-green':    '0 0 0 transparent',
        'glow-purple':   '0 0 0 transparent',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'fade-down':  'fadeDown 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':    'fadeIn 0.4s ease both',
        // stub out old animations so references don't error
        'float':       'none',
        'float-slow':  'none',
        'glow-pulse':  'none',
        'shimmer':     'none',
        'pulse-soft':  'pulseSoft 3s ease-in-out infinite',
        'slide-up':    'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'blur-in':     'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both',
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
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
