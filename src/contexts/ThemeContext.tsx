import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, type ThemeColors } from '../theme/colors';
import type { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_KEY = 'app_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('dark');
  const [isLoading, setIsLoading] = useState(true);

  // Load stored theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
        } else if (systemColorScheme === 'light' || systemColorScheme === 'dark') {
          setThemeState(systemColorScheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  const setTheme = useCallback(async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem(THEME_KEY, newTheme);
  }, []);

  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const isDark = theme === 'dark';

  if (isLoading) {
    return null; // Or a splash screen
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
