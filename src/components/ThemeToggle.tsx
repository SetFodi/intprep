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
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      aria-label="Toggle theme"
    >
      {/* Background gradient that changes based on theme */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700' 
          : 'bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400'
      }`} />
      
      {/* Animated background blur effect */}
      <div className={`absolute inset-0 rounded-xl blur-sm transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 opacity-50' 
          : 'bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 opacity-50'
      }`} />
      
      {/* Icon container */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Sun icon for light mode */}
        <Sun 
          className={`h-6 w-6 text-white transition-all duration-500 transform ${
            theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-180 scale-0 opacity-0'
          }`}
        />
        
        {/* Moon icon for dark mode */}
        <Moon 
          className={`absolute h-6 w-6 text-white transition-all duration-500 transform ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-180 scale-0 opacity-0'
          }`}
        />
      </div>
      
      {/* Hover effect ring */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-white/30 transition-all duration-300" />
      
      {/* Sparkle effects for light mode */}
      {theme === 'light' && (
        <>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
        </>
      )}
      
      {/* Star effects for dark mode */}
      {theme === 'dark' && (
        <>
          <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-blue-300 rounded-full animate-pulse" />
          <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-purple-300 rounded-full animate-ping opacity-75" />
          <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-indigo-200 rounded-full animate-pulse" />
        </>
      )}
    </button>
  );
}
