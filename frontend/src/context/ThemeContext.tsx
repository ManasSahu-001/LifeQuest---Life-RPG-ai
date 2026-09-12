import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, DEFAULT_THEME_ID, getTheme, ThemeDefinition } from '../themes/index.js';
import { api } from '../api/client.js';

interface ThemeContextType {
  currentThemeId: string;
  theme: ThemeDefinition;
  setThemeId: (themeId: string, persist?: boolean) => Promise<void>;
  availableThemes: ThemeDefinition[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem('liferpg_theme') || DEFAULT_THEME_ID;
  });

  const activeTheme = getTheme(currentThemeId);

  useEffect(() => {
    // Apply data-theme attribute on document root
    document.documentElement.setAttribute('data-theme', currentThemeId);
    localStorage.setItem('liferpg_theme', currentThemeId);
  }, [currentThemeId]);

  const setThemeId = async (themeId: string, persist = true) => {
    if (!THEMES[themeId]) return;

    setCurrentThemeId(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('liferpg_theme', themeId);

    if (persist && localStorage.getItem('liferpg_token')) {
      try {
        await api.updateTheme(themeId);
      } catch (err) {
        console.warn('Could not persist theme to backend', err);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentThemeId,
        theme: activeTheme,
        setThemeId,
        availableThemes: Object.values(THEMES),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
