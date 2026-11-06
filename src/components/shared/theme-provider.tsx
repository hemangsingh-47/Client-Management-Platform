'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ResolvedTheme, ThemeContextType } from '@/types/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'freelancehub-theme';

function applyThemeClass(targetTheme: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (targetTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
  } catch {
    return 'system';
  }
}

function resolveTheme(currentTheme: Theme): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  if (currentTheme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return currentTheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always initialize identically on SSR and client initial hydration
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Synchronize with stored preference and system scheme after hydration
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const stored = getStoredTheme();
      setThemeState(stored);
      const calculated = resolveTheme(stored);
      setResolvedTheme(calculated);
      applyThemeClass(calculated);
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setThemeState((current) => {
        if (current === 'system') {
          const calculated = resolveTheme('system');
          setResolvedTheme(calculated);
          applyThemeClass(calculated);
        }
        return current;
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      cancelAnimationFrame(frameId);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // storage unavailable
    }
    const calculated = resolveTheme(newTheme);
    setResolvedTheme(calculated);
    applyThemeClass(calculated);
  };

  const toggleTheme = () => {
    const next: Theme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
