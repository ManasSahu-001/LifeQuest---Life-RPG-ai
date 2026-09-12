import { ThemeDefinition } from './types.js';

export const themeB: ThemeDefinition = {
  id: 'theme-b',
  name: 'High Fantasy Realm',
  subtitle: 'Medieval Tavern & Royal Heraldry',
  badge: 'ROYAL GUILD',
  colors: {
    bg: '#12100e',
    surface: '#1c1814',
    surfaceHover: '#28221b',
    border: '#d4af3740',
    primary: '#d4af37', // Antique Gold
    primaryHover: '#e6c35c',
    secondary: '#8b1e1e', // Imperial Crimson
    accent: '#3a7d44', // Forest Ranger Green
    gold: '#f0c048',
    text: '#f5ecd7', // Parchment ivory
    muted: '#8f8373',
    cardGlow: 'rgba(212, 175, 55, 0.22)',
    gradientBg: 'radial-gradient(ellipse at top, #241c14 0%, #12100e 75%)',
  },
  typography: {
    headingFont: '"Cinzel", "Georgia", "Times New Roman", serif',
    bodyFont: '"Merriweather", "Georgia", serif',
    monoFont: '"Courier New", monospace',
  },
  effects: {
    borderRadius: '0.6rem', // Rounded heraldic shields
    cardBorderWidth: '2px',
    glassmorphic: false,
    scanlines: false,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(212, 175, 55, 0.05)',
  },
};
