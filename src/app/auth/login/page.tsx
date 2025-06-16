'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { LogIn, Mail, Lock, Eye, EyeOff, Brain, ArrowRight, CheckCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      const from = searchParams?.get('from') || '/dashboard';
      router.push(from);
    }
  }, [status, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.ok) {
        const from = searchParams?.get('from') || '/dashboard';
        router.push(from);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center mb-8">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <span className="ml-3 text-2xl font-semibold text-slate-900 dark:text-white">
              InterviewAI
            </span>
          </Link>
          
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Welcome back
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Sign in to continue your interview preparation
          </p>
        </div>

        {/* Success Message */}
        {searchParams?.get('registered') && (
          <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
              <div className="text-sm text-green-700 dark:text-green-200">
                Registration successful! Please sign in with your credentials.
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="h-5 w-5 mr-2" />
                    <span>Sign in</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  Don&apos;t have an account?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Create a new account
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
} 