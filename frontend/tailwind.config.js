/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      colors: {
        rpg: {
          bg: 'var(--rpg-bg)',
          surface: 'var(--rpg-surface)',
          surfaceHover: 'var(--rpg-surface-hover)',
          border: 'var(--rpg-border)',
          primary: 'var(--rpg-primary)',
          primaryHover: 'var(--rpg-primary-hover)',
          secondary: 'var(--rpg-secondary)',
          accent: 'var(--rpg-accent)',
          gold: 'var(--rpg-gold)',
          text: 'var(--rpg-text)',
          muted: 'var(--rpg-muted)',
          cardGlow: 'var(--rpg-card-glow)',
        },
        forest: {
          dark: '#02150d',
          base: '#062b1d',
          surface: '#0d472c',
          border: '#166534',
          accent: '#10b981',
          glow: '#34d399',
          gold: '#fbbf24',
        },
        samurai: {
          dark: '#09090b',
          base: '#121216',
          surface: '#1c1b22',
          border: '#3f1519',
          crimson: '#dc2626',
          blood: '#991b1b',
          gold: '#f59e0b',
          sakura: '#f472b6',
        },
        city: {
          dark: '#050d1a',
          base: '#0a192f',
          surface: '#112240',
          border: '#1e3a5f',
          cyan: '#00f2fe',
          amber: '#f59e0b',
          steel: '#334155',
        },
      },
      fontFamily: {
        heading: 'var(--rpg-font-heading)',
        body: 'var(--rpg-font-body)',
        mono: 'var(--rpg-font-mono)',
        forest: ['Cinzel', 'serif'],
        samurai: ['"Noto Serif JP"', 'serif'],
        city: ['"Space Grotesk"', 'monospace'],
      },
      boxShadow: {
        'rpg-glow': '0 0 20px -5px var(--rpg-card-glow)',
        'rpg-glow-lg': '0 0 30px -5px var(--rpg-card-glow)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slash': 'slash 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px var(--rpg-card-glow))' },
          '50%': { opacity: '.6', filter: 'drop-shadow(0 0 2px var(--rpg-card-glow))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        slash: {
          '0%': { opacity: '0', transform: 'scaleX(0) rotate(-25deg)' },
          '50%': { opacity: '1', transform: 'scaleX(1) rotate(-25deg)' },
          '100%': { opacity: '0', transform: 'scaleX(1.2) rotate(-25deg) translateX(40px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

