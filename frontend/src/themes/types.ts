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

export interface ThemeTerminology {
  quest: string;
  quests: string;
  boss: string;
  character: string;
  skills: string;
  xp: string;
  currency: string;
  realmProgress: string;
  realmMetric: string;
}

export interface ThemeHero {
  name: string;
  class: string;
  avatarEffect: string;
  weapon: string;
  gearSlots: string[];
}

export interface ThemeBoss {
  name: string;
  title: string;
  maxHp: number;
  avatarType: string;
  flavor: string;
}

export interface ThemeWorldProgress {
  title: string;
  description: string;
}

export interface ThemePreview {
  bannerGradient: string;
  cardGradient: string;
  tag: string;
  features: string[];
}

export interface ThemeDefinition {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  badge: string;
  icon: string;
  requiredLevel: number;
  unlockTitle: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  effects: ThemeEffects;
  terminology: ThemeTerminology;
  hero: ThemeHero;
  boss: ThemeBoss;
  worldProgress: ThemeWorldProgress;
  preview: ThemePreview;
}

