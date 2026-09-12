import { ThemeDefinition } from './types.js';

export const themeC: ThemeDefinition = {
  id: 'theme-c',
  name: 'Solarpunk Metropolis',
  subtitle: 'Biophilic Glass & Radiant Flora',
  badge: 'ECO-HARVEST',
  colors: {
    bg: '#08140f',
    surface: '#0f241c',
    surfaceHover: '#163328',
    border: '#10b98133',
    primary: '#10b981', // Radiant Emerald
    primaryHover: '#34d399',
    secondary: '#f59e0b', // Solar Amber
    accent: '#06b6d4', // Pure Water Cyan
    gold: '#fbbf24',
    text: '#e6f7f0',
    muted: '#6a9683',
    cardGlow: 'rgba(16, 185, 129, 0.25)',
    gradientBg: 'radial-gradient(ellipse at top, #143829 0%, #08140f 75%)',
  },
  typography: {
    headingFont: '"Outfit", "Plus Jakarta Sans", system-ui, sans-serif',
    bodyFont: '"Inter", system-ui, sans-serif',
    monoFont: '"Fira Code", monospace',
  },
  effects: {
    borderRadius: '1rem', // Smooth organic curves
    cardBorderWidth: '1px',
    glassmorphic: true,
    scanlines: false,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 15px -3px rgba(16, 185, 129, 0.2)',
  },
};
