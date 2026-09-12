import { ThemeDefinition } from './types.js';

export const themeA: ThemeDefinition = {
  id: 'theme-a',
  name: 'Cyberpunk Synthwave',
  subtitle: 'Neo-Tokyo High-Tech HUD',
  badge: 'CYBER-GRID',
  colors: {
    bg: '#08090e',
    surface: '#0e111a',
    surfaceHover: '#161a28',
    border: '#00f0ff33',
    primary: '#00f0ff',
    primaryHover: '#33f3ff',
    secondary: '#ff007f',
    accent: '#ffe600',
    gold: '#ffe600',
    text: '#e2f3ff',
    muted: '#6a7b95',
    cardGlow: 'rgba(0, 240, 255, 0.25)',
    gradientBg: 'radial-gradient(ellipse at top, #141b2d 0%, #08090e 70%)',
  },
  typography: {
    headingFont: '"Orbitron", "Rajdhani", system-ui, sans-serif',
    bodyFont: '"Inter", system-ui, sans-serif',
    monoFont: '"JetBrains Mono", "Fira Code", monospace',
  },
  effects: {
    borderRadius: '0.25rem', // Angular Cyber aesthetic
    cardBorderWidth: '1px',
    glassmorphic: true,
    scanlines: true,
    boxShadow: '0 0 25px -5px rgba(0, 240, 255, 0.2)',
  },
};
