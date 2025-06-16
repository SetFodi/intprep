'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Brain, Code, Settings, LogIn, UserPlus, User, LogOut, BarChart3 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useSession, signOut } from 'next-auth/react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'AI Interview', href: '/ai-interview', icon: Brain },
  { name: 'Coding', href: '/coding', icon: Code },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="flex flex-col h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/20 shadow-xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10 dark:border-slate-700/20">
        <Link href="/" className="flex items-center group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="ml-3">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              InterviewAI
            </span>
            <div className="text-xs text-slate-500 dark:text-slate-400">AI-Powered Practice</div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const isProtected = item.href !== '/' && item.href !== '/auth/login' && item.href !== '/auth/register';
          const canAccess = !isProtected || status === 'authenticated';
          
          return (
            <Link
              key={item.name}
              href={canAccess ? item.href : '/auth/login'}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200/50 dark:border-blue-800/50'
                  : canAccess
                  ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  : 'text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <div className={`relative ${isActive ? 'transform scale-110' : 'group-hover:scale-105'} transition-transform`}>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30"></div>
                )}
                <div className={`relative ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : ''} p-2 rounded-lg`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
              <span className="ml-3 font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Section */}
      <div className="flex-shrink-0 p-4 border-t border-white/10 dark:border-slate-700/20">
        {status === 'authenticated' ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center px-4 py-3 bg-slate-50/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/20">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <User className="h-5 w-5 text-white" />
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
              className="w-full group flex items-center px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
            >
              <div className="relative group-hover:scale-105 transition-transform">
                <div className="p-2 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                  <LogOut className="h-5 w-5" />
                </div>
              </div>
              <span className="ml-3">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="w-full group flex items-center px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
            >
              <div className="relative group-hover:scale-105 transition-transform">
                <div className="p-2 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <LogIn className="h-5 w-5" />
                </div>
              </div>
              <span className="ml-3">Sign In</span>
            </Link>
            <Link
              href="/auth/register"
              className="w-full group flex items-center px-4 py-3 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <div className="relative group-hover:scale-105 transition-transform">
                <div className="p-2 rounded-lg">
                  <UserPlus className="h-5 w-5" />
                </div>
              </div>
              <span className="ml-3 font-semibold">Get Started</span>
            </Link>
          </div>
        )}
        
        {/* Theme Toggle */}
        <div className="mt-4 flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
} 