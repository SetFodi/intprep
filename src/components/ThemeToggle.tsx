'use client';

import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="h-10 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
      aria-label="Toggle theme"
    >
      {/* Track background with gradient */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
      }`} />
      
      {/* Sliding indicator */}
      <div className={`relative flex items-center justify-center w-6 h-6 bg-white dark:bg-slate-800 rounded-full shadow-md transform transition-transform duration-300 ${
        theme === 'dark' ? 'translate-x-8' : 'translate-x-1'
      }`}>
        {/* Sun icon for light mode */}
        <Sun 
          className={`absolute h-4 w-4 text-orange-500 transition-all duration-300 transform ${
            theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-180 scale-0 opacity-0'
          }`}
        />
        
        {/* Moon icon for dark mode */}
        <Moon 
          className={`absolute h-4 w-4 text-indigo-600 transition-all duration-300 transform ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-180 scale-0 opacity-0'
          }`}
        />
      </div>
      
      {/* Light mode indicator text */}
      <span className={`absolute left-2 text-xs font-medium text-white transition-opacity duration-300 ${
        theme === 'light' ? 'opacity-0' : 'opacity-70'
      }`}>
        Light
      </span>
      
      {/* Dark mode indicator text */}
      <span className={`absolute right-2 text-xs font-medium text-white transition-opacity duration-300 ${
        theme === 'dark' ? 'opacity-0' : 'opacity-70'
      }`}>
        Dark
      </span>
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 rounded-full blur-sm transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20'
      }`} />
    </button>
  );
}
