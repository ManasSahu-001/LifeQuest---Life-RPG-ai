import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { THEMES, DEFAULT_THEME_ID, getTheme, normalizeThemeId, isThemeUnlocked, ThemeDefinition } from '../themes/index.js';
import { api } from '../api/client.js';
import { audioEngine } from '../services/audioEngine.js';

interface ThemeContextType {
  currentThemeId: string;
  theme: ThemeDefinition;
  setThemeId: (
    themeId: string,
    userLevelOrPersist?: number | boolean,
    persist?: boolean,
    bypassLevelCheck?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  switchTheme: (
    themeId: string,
    userLevelOrPersist?: number | boolean,
    persist?: boolean,
    bypassLevelCheck?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  availableThemes: ThemeDefinition[];
  isThemeSelectorOpen: boolean;
  openThemeSelector: () => void;
  closeThemeSelector: () => void;
  isTransitioning: boolean;
  checkUnlocked: (themeId: string, userLevel?: number) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return normalizeThemeId(localStorage.getItem('liferpg_theme') || DEFAULT_THEME_ID);
  });
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeTheme = getTheme(currentThemeId);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentThemeId);
    localStorage.setItem('liferpg_theme', currentThemeId);
  }, [currentThemeId]);

  const checkUnlocked = useCallback((themeId: string, userLevel = 1) => {
    return isThemeUnlocked(themeId, userLevel);
  }, []);

  const setThemeId = useCallback(async (
    themeId: string,
    userLevelOrPersist?: number | boolean,
    persist?: boolean,
    bypassLevelCheck?: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    let userLevel: number | undefined;
    let shouldPersist = true;

    if (typeof userLevelOrPersist === 'boolean') {
      shouldPersist = userLevelOrPersist;
    } else if (typeof userLevelOrPersist === 'number') {
      userLevel = userLevelOrPersist;
      if (typeof persist === 'boolean') {
        shouldPersist = persist;
      }
    }

    const norm = normalizeThemeId(themeId);
    const targetTheme = getTheme(norm);

    // Only enforce level lock if userLevel was explicitly supplied as a number and bypassLevelCheck is not true
    if (!bypassLevelCheck && typeof userLevel === 'number' && userLevel < targetTheme.requiredLevel) {
      return {
        success: false,
        error: `Theme locked! "${targetTheme.name}" unlocks at Level ${targetTheme.requiredLevel}. (Your Level: ${userLevel})`,
      };
    }

    setIsTransitioning(true);
    document.documentElement.setAttribute('data-theme', norm);
    localStorage.setItem('liferpg_theme', norm);
    audioEngine.switchTheme(norm);
    setCurrentThemeId(norm);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    if (shouldPersist && localStorage.getItem('liferpg_token')) {
      try {
        await api.updateTheme(norm);
      } catch (err: any) {
        console.warn('Could not persist theme to backend', err);
      }
    }

    return { success: true };
  }, []);


  return (
    <ThemeContext.Provider
      value={{
        currentThemeId,
        theme: activeTheme,
        setThemeId,
        switchTheme: setThemeId,
        availableThemes: Object.values(THEMES),
        isThemeSelectorOpen,
        openThemeSelector: () => setIsThemeSelectorOpen(true),
        closeThemeSelector: () => setIsThemeSelectorOpen(false),
        isTransitioning,
        checkUnlocked,
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

