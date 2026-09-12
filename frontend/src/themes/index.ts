import { themeA } from './themeA.js';
import { themeB } from './themeB.js';
import { themeC } from './themeC.js';
import { themeD } from './themeD.js';
import { themeE } from './themeE.js';
import { themeF } from './themeF.js';
import { ThemeDefinition } from './types.js';

export * from './types.js';
export { themeA, themeB, themeC, themeD, themeE, themeF };

export const THEMES: Record<string, ThemeDefinition> = {
  'theme-a': themeA,
  'theme-b': themeB,
  'theme-c': themeC,
  'theme-d': themeD,
  'theme-e': themeE,
  'theme-f': themeF,
};

export const THEME_ALIASES: Record<string, string> = {
  cyberpunk: 'theme-a',
  fantasy: 'theme-b',
  solarpunk: 'theme-c',
  forest: 'theme-d',
  samurai: 'theme-e',
  city: 'theme-f',
};

export const DEFAULT_THEME_ID = 'theme-a';

export function normalizeThemeId(themeId: string): string {
  if (!themeId) return DEFAULT_THEME_ID;
  const clean = themeId.toLowerCase().trim();
  if (THEMES[clean]) return clean;
  if (THEME_ALIASES[clean]) return THEME_ALIASES[clean];
  return DEFAULT_THEME_ID;
}

export function getTheme(themeId: string): ThemeDefinition {
  const norm = normalizeThemeId(themeId);
  return THEMES[norm] || THEMES[DEFAULT_THEME_ID];
}

export function isThemeUnlocked(themeId: string, userLevel: number = 1): boolean {
  const theme = getTheme(themeId);
  return userLevel >= (theme?.requiredLevel ?? 1);
}

export function getThemeRequiredLevel(themeId: string): number {
  const theme = getTheme(themeId);
  return theme?.requiredLevel ?? 1;
}

