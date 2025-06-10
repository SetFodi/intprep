'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch - just render children without context during SSR
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

export function useTheme() {
  // Return a default implementation to avoid errors
  return {
    theme: 'light' as Theme,
    toggleTheme: () => {}
  };
}
