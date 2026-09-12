import { themeA } from './themeA.js';
import { themeB } from './themeB.js';
import { themeC } from './themeC.js';
import { ThemeDefinition } from './types.js';

export * from './types.js';
export { themeA, themeB, themeC };

export const THEMES: Record<string, ThemeDefinition> = {
  'theme-a': themeA,
  'theme-b': themeB,
  'theme-c': themeC,
};

export const DEFAULT_THEME_ID = 'theme-a';

export function getTheme(themeId: string): ThemeDefinition {
  return THEMES[themeId] || THEMES[DEFAULT_THEME_ID];
}
