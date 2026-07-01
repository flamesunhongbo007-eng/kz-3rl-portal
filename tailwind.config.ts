import type { Config } from 'tailwindcss';

// 绿松石色系（复刻 Tzafit II Power Station）
// 主色 #00D7A0（青绿），深 #009B77，背景 #080D18
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 原 KZ-3RL 背景（保留兼容性）
        bg: '#080D18',
        'bg-soft': '#0A101E',
        'bg-mid': '#0E1728',
        'bg-card': 'rgba(255,255,255,0.035)',
        'bg-card-h': 'rgba(0,215,160,0.07)',
        'bg-grid': 'rgba(0, 215, 160, 0.05)',
        'bg-void': '#080D18',

        // 文字
        ink: '#FFFFFF',
        'ink-mid': '#C0D4E8',
        'ink-muted': '#6A8CAA',
        'ink-dim': '#6A8CAA',

        // 绿松石主色（替换原 c1）
        teal: '#00D7A0',
        'teal-dark': '#009B77',
        'teal-mid': '#00BF8F',
        'teal-glow': 'rgba(0, 215, 160, 0.25)',
        'teal-dim': 'rgba(0, 215, 160, 0.08)',

        // 旧 c1-c8 全部重定向到 teal 系，保持兼容
        c1: '#00D7A0',  // teal
        c2: '#00BF8F',
        c3: '#009B77',
        c4: '#00D7A0',
        c5: '#33e0b6',
        c6: '#4ddbc1',
        c7: '#009980',
        c8: '#007a64',
        c9: '#33e0b6',

        // 保留 accent
        danger: '#ef4444',
        running: '#22c55e',
        border: 'rgba(0,215,160,0.18)',
        'border-h': 'rgba(0,215,160,0.55)',
        glass: 'rgba(15, 23, 42, 0.5)',
      },
      fontFamily: {
        sans: ['"Segoe UI"', '"Helvetica Neue"', 'Arial', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'cad-grid':
          'linear-gradient(rgba(0,215,160,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,215,160,.025) 1px, transparent 1px)',
      },
      backgroundSize: {
        'cad': '55px 55px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease both',
        'slide-up': 'slideUp 0.5s ease both',
        'pulse-soft': 'pulseSoft 2.2s ease-in-out infinite',
        'spin-slow': 'spin 80s linear infinite',
        'spin-rev': 'spinRev 40s linear infinite',
        'scan': 'scanDown 6s ease-in-out infinite',
        'blink': 'blink 2.2s infinite',
        'fade-up': 'fadeUp 0.9s ease both',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
        spin: { 'to': { transform: 'rotate(360deg)' } },
        spinRev: { 'to': { transform: 'rotate(-360deg)' } },
        scanDown: { '0%': { top: '0', opacity: '0' }, '5%, 95%': { opacity: '0.35' }, '100%': { top: '100%', opacity: '0' } },
        blink: { '0%, 100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.4', transform: 'scale(0.7)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(22px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};

export default config;
