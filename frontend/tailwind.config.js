/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
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
        }
      },
      fontFamily: {
        heading: 'var(--rpg-font-heading)',
        body: 'var(--rpg-font-body)',
        mono: 'var(--rpg-font-mono)',
      },
      boxShadow: {
        'rpg-glow': '0 0 20px -5px var(--rpg-card-glow)',
        'rpg-glow-lg': '0 0 30px -5px var(--rpg-card-glow)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px var(--rpg-card-glow))' },
          '50%': { opacity: '.6', filter: 'drop-shadow(0 0 2px var(--rpg-card-glow))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
