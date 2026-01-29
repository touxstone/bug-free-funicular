'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  
  // Cargar theme de localStorage después de montar
  useEffect(() => {
    console.log("ThemeProvider mounted");
    setMounted(true);
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  // Guardar theme en localStorage cuando cambie
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('app-theme', theme);
    }
  }, [theme, mounted]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  // No renderizar hasta que esté montado (evita hydration error)
  /* if (!mounted) {
    return <>{children}</>;
  } */
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {mounted && children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}