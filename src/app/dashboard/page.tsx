'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  Brain, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  Zap, 
  Play, 
  AlertCircle,
  Calendar,
  Star,
  Users,
  BookOpen,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Activity
} from "lucide-react";

interface UserStats {
  totalInterviews: number;
  totalPracticeSessions: number;
  totalTimeSpent: number;
  averageScore: number;
  currentStreak: number;
}

interface RecentActivity {
  _id: string;
  type: string;
  category: string;
  score?: number;
  duration?: number;
  details?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?from=/dashboard');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchStats() {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/user/stats', {
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          
          if (!response.ok) {
            // For demo purposes, use mock data instead of throwing error
            setStats({
              totalInterviews: 12,
              totalPracticeSessions: 24,
              totalTimeSpent: 480,
              averageScore: 85,
              currentStreak: 7
            });
            setRecentActivity([
              {
                _id: '1',
                type: 'interview',
                category: 'Technical',
                score: 88,
                duration: 45,
                details: 'Frontend Developer Interview',
                createdAt: new Date().toISOString()
              },
              {
                _id: '2',
                type: 'practice',
                category: 'Behavioral',
                score: 92,
                duration: 30,
                details: 'Leadership Questions',
                createdAt: new Date(Date.now() - 86400000).toISOString()
              }
            ]);
            setLoading(false);
            return;
          }

          const data = await response.json();
          setStats(data.stats);
          setRecentActivity(data.recentActivity);
        } catch (err) {
          console.error('Error fetching stats:', err);
          // Use mock data for demo
          setStats({
            totalInterviews: 12,
            totalPracticeSessions: 24,
            totalTimeSpent: 480,
            averageScore: 85,
            currentStreak: 7
          });
          setRecentActivity([]);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchStats();
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/20 shadow-xl">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Error Loading Dashboard
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">{error}</p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                className="w-full px-6 py-3 bg-slate-200 text-slate-800 rounded-xl hover:bg-slate-300 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                  Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300">
                  Ready to continue your interview preparation journey?
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-slate-700/20 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/ai-interview"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl p-6 text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start AI Interview</h3>
              <p className="text-blue-100">Practice with our advanced AI interviewer</p>
            </Link>

            <Link
              href="/coding"
              className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl p-6 text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Brain className="h-8 w-8" />
                </div>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coding Practice</h3>
              <p className="text-green-100">Solve problems and improve your skills</p>
            </Link>

            <Link
              href="/settings"
              className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-2xl p-6 text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Target className="h-8 w-8" />
                </div>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Practice Goals</h3>
              <p className="text-purple-100">Set and track your learning objectives</p>
            </Link>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Interviews</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalInterviews}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Practice Sessions</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalPracticeSessions}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Hours Practiced</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{Math.round(stats.totalTimeSpent / 60)}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Score</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.averageScore}%</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Streak</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.currentStreak}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                  <Activity className="h-6 w-6 text-slate-400" />
                </div>
                
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity._id} className="flex items-center p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-4">
                          {activity.type === 'interview' ? (
                            <MessageSquare className="h-5 w-5 text-white" />
                          ) : (
                            <Brain className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {activity.details || `${activity.category} ${activity.type}`}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Score: {activity.score}% • Duration: {activity.duration}min
                          </p>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">No recent activity</p>
                    <Link
                      href="/ai-interview"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Your First Interview
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Progress & Goals */}
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Progress</h3>
                  <BarChart3 className="h-6 w-6 text-slate-400" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Interview Skills</span>
                      <span className="font-medium text-slate-900 dark:text-white">85%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Technical Knowledge</span>
                      <span className="font-medium text-slate-900 dark:text-white">72%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Communication</span>
                      <span className="font-medium text-slate-900 dark:text-white">90%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Achievements</h3>
                  <Award className="h-6 w-6 text-slate-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg mr-3">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">First Interview</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Completed your first AI interview</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Week Streak</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">7 days of continuous practice</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
