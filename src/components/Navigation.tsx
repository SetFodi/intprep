'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Brain, Code, LogIn, UserPlus, User, LogOut, BarChart3 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useSession, signOut } from 'next-auth/react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'AI Interview', href: '/ai-interview', icon: Brain },
  { name: 'Coding', href: '/coding', icon: Code },
];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <Link href="/" className="flex items-center group">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3">
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              InterviewAI
            </span>
            <div className="text-xs text-slate-500 dark:text-slate-400">AI-Powered Practice</div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const isProtected = item.href !== '/';
          const canAccess = !isProtected || status === 'authenticated';
          
          return (
            <Link
              key={item.name}
              href={canAccess ? item.href : '/auth/login'}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  : canAccess
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  : 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        {/* Theme Toggle */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Theme
            </span>
          </div>
          <ThemeToggle />
        </div>
        
        {status === 'authenticated' ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            
            {/* Sign Out Button */}
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              href="/auth/login"
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <LogIn className="h-5 w-5 mr-3" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/auth/register"
              className="w-full flex items-center px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-3" />
              <span>Get Started</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
} 