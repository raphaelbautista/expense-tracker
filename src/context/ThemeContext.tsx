// context/ThemeContext.tsx
"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const targetElement = document.documentElement;
    
    if (savedTheme) {
      setTheme(savedTheme);
      targetElement.classList.add(savedTheme);
    } else {
      targetElement.classList.add('light');
    }
  }
}, []);

const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  const targetElement = document.documentElement;

  targetElement.classList.remove(theme);
  targetElement.classList.add(newTheme);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', newTheme);
  }
  setTheme(newTheme);
};

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};