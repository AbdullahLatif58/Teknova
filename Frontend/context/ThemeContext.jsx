import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);
const THEMES = ['theme-1', 'theme-2', 'theme-3'];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('theme-1');

  useEffect(() => {
    const saved = localStorage.getItem('teknova-theme');
    if (saved && THEMES.includes(saved)) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('teknova-theme', theme);
  }, [theme]);

  // variation: 1, 2, or 3 — used by all existing components
  const variation = THEMES.indexOf(theme) + 1;

  // switchTheme: NO redirect, stays on current page
  const switchTheme = useCallback((newTheme) => {
    if (THEMES.includes(newTheme)) setTheme(newTheme);
  }, []);

  const cycleTheme = useCallback(() => {
    setTheme((cur) => THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length]);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, variation, switchTheme, cycleTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}
