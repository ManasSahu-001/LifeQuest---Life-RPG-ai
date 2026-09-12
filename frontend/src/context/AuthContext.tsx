import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api/client.js';
import { useTheme } from './ThemeContext.js';

export interface Character {
  id: number;
  userId: number;
  name: string;
  title: string;
  level: number;
  current_xp: number;
  requiredXP: number;
  progressPercentage: number;
  gold: number;
  streak_count: number;
  last_completed_date: string | null;
  intellect: number;
  strength: number;
  creativity: number;
  discipline: number;
  avatar_url?: string;
}

export interface User {
  id: number;
  email: string;
  theme: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  character: Character | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name?: string, theme?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshCharacter: () => Promise<void>;
  updateCharacterState: (char: Character) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('liferpg_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setThemeId } = useTheme();

  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('liferpg_token');
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.data.success) {
        setUser(res.data.user);
        setCharacter(res.data.character);
        if (res.data.user.theme) {
          setThemeId(res.data.user.theme, false);
        }
      }
    } catch (err) {
      console.warn('Failed to verify token:', err);
      localStorage.removeItem('liferpg_token');
      setToken(null);
      setUser(null);
      setCharacter(null);
    } finally {
      setIsLoading(false);
    }
  }, [setThemeId]);

  useEffect(() => {
    loadUser();

    const handleUnauthorized = () => {
      localStorage.removeItem('liferpg_token');
      setToken(null);
      setUser(null);
      setCharacter(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    if (res.data.success) {
      localStorage.setItem('liferpg_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setCharacter(res.data.character);
      if (res.data.user.theme) {
        setThemeId(res.data.user.theme, false);
      }
    }
  };

  const signup = async (email: string, pass: string, name?: string, chosenTheme?: string) => {
    const res = await api.signup({
      email,
      password: pass,
      characterName: name,
      theme: chosenTheme,
    });
    if (res.data.success) {
      localStorage.setItem('liferpg_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setCharacter(res.data.character);
      if (chosenTheme) {
        setThemeId(chosenTheme, false);
      }
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // Ignore network failure on logout
    }
    localStorage.removeItem('liferpg_token');
    setToken(null);
    setUser(null);
    setCharacter(null);
  };

  const refreshCharacter = async () => {
    try {
      const res = await api.getCharacter();
      if (res.data.success) {
        setCharacter(res.data.character);
      }
    } catch (err) {
      console.error('Failed to refresh character', err);
    }
  };

  const updateCharacterState = (newChar: Character) => {
    setCharacter(newChar);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        character,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshCharacter,
        updateCharacterState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
