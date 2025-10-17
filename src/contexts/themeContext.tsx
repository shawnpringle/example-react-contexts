import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
export type Theme = 'light' | 'dark' | string;

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  const value = useMemo(() => ({ theme, setTheme }), [theme]);


  useMemo(() => {
    const headEls = document.getElementsByTagName('head');
    if (headEls.length === 0) return () => {};
    const headEl = headEls[0];

    // Add new theme-style link element if needed (for external CSS themes   
    const LinkEl = document.createElement('link');
    LinkEl.setAttribute('rel', 'stylesheet');
    LinkEl.setAttribute('data-theme-style', 'true');
    LinkEl.setAttribute('href', `/themes/${theme}.css`);
    headEl.appendChild(LinkEl);

    return () => {
      // Remove any existing theme-style link elements
      const existingLinks = headEl.querySelectorAll('link[data-theme-style]');
      existingLinks.forEach(link => headEl.removeChild(link));
    }


  }, [theme]);

    // We now rely on the inline themeMap and data-theme attribute; no external CSS files required.
    return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

export default ThemeContext;
