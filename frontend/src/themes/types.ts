export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceHover: string;
  border: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  gold: string;
  text: string;
  muted: string;
  cardGlow: string;
  gradientBg: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
}

export interface ThemeEffects {
  borderRadius: string;
  cardBorderWidth: string;
  glassmorphic: boolean;
  scanlines: boolean;
  boxShadow: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  effects: ThemeEffects;
}
