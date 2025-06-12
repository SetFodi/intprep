'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Brain, Code, Settings, LogIn, UserPlus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'AI Interview', href: '/ai-interview', icon: Brain },
  { name: 'Coding Practice', href: '/coding', icon: Code },
  { name: 'Dashboard', href: '/dashboard', icon: Settings },
];

const authNavigation = [
  { name: 'Login', href: '/auth/login', icon: LogIn },
  { name: 'Register', href: '/auth/register', icon: UserPlus },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              AI Farte
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100'
                    : 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${
                  isActive
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Auth Links */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          {user ? (
            <div className="space-y-4">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <LogIn className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {authNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100'
                        : 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${
                      isActive
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
} 