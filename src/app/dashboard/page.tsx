'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  Brain, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Play, 
  AlertCircle,
  Calendar,
  ArrowRight,
  BarChart3,
  Activity,
  BookOpen
} from "lucide-react";

interface UserStats {
  totalInterviews: number;
  totalPracticeSessions: number;
  totalCodingChallenges: number;
  totalMessages: number;
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

interface UsageInfo {
  dailyLimit: number;
  usedToday: number;
  remainingToday: number;
  canUseAI: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
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
            // Initialize with empty stats for new users
            setStats({
              totalInterviews: 0,
              totalPracticeSessions: 0,
              totalCodingChallenges: 0,
              totalMessages: 0,
              totalTimeSpent: 0,
              averageScore: 0,
              currentStreak: 0
            });
            setRecentActivity([]);
            setLoading(false);
            return;
          }

          const data = await response.json();
          setStats(data.stats);
          setRecentActivity(data.recentActivity);
        } catch (err) {
          console.error('Error fetching stats:', err);
          // Initialize with empty stats instead of showing error
          setStats({
            totalInterviews: 0,
            totalPracticeSessions: 0,
            totalCodingChallenges: 0,
            totalMessages: 0,
            totalTimeSpent: 0,
            averageScore: 0,
            currentStreak: 0
          });
          setRecentActivity([]);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchStats();
  }, [status]);

  // Refresh stats when component becomes visible (user returns from another page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && status === 'authenticated') {
        // Refresh stats when user returns to the dashboard
        fetchStats();
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setRecentActivity(data.recentActivity);
        }
      } catch (err) {
        console.error('Error refreshing stats:', err);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center bg-white dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Error Loading Dashboard
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">An error occurred while loading your dashboard.</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                className="w-full px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
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
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Ready to continue your interview preparation?
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <AIInterviewCard />
            <Link
              href="/coding"
              className="group bg-green-600 hover:bg-green-700 rounded-lg p-6 text-white transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coding Practice</h3>
              <p className="text-green-100">Solve problems and improve your skills</p>
            </Link>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Interviews</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalInterviews}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Messages Sent</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalMessages}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Coding Challenges</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalCodingChallenges}</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Hours Practiced</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(stats.totalTimeSpent / 60)}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Score</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.averageScore > 0 ? `${stats.averageScore}%` : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                  <Activity className="h-5 w-5 text-slate-400" />
                </div>
                
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity._id} className="flex items-center p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                          {activity.type === 'interview' ? (
                            <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {activity.details || `${activity.category} ${activity.type}`}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {activity.score && `Score: ${activity.score}%`} 
                            {activity.duration && ` • Duration: ${activity.duration}min`}
                          </p>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">No recent activity</p>
                    <Link
                      href="/ai-interview"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Your First Interview
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Progress</h3>
                  <BarChart3 className="h-5 w-5 text-slate-400" />
                </div>
                
                {stats && stats.totalInterviews > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Interview Skills</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {stats.averageScore > 0 ? `${stats.averageScore}%` : 'No data'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(stats.averageScore || 0, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Practice Consistency</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {stats.currentStreak} day streak
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min((stats.currentStreak / 7) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Start practicing to see your progress</p>
                    <Link
                      href="/ai-interview"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Begin Practice
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIInterviewCard() {
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/user/usage');
        if (response.ok) {
          const data = await response.json();
          setUsage(data);
        }
      } catch (error) {
        console.error('Error fetching usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (loading) {
    return (
      <div className="bg-blue-600 rounded-lg p-6 text-white">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/ai-interview"
      className="group bg-blue-600 hover:bg-blue-700 rounded-lg p-6 text-white transition-colors relative"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <MessageSquare className="h-6 w-6" />
        </div>
        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Start AI Interview</h3>
      <p className="text-blue-100 mb-3">Practice with our advanced AI interviewer</p>
      
      {usage && (
        <div className="text-sm">
          {usage.canUseAI ? (
            <span className="text-blue-200">
              {usage.remainingToday} / {usage.dailyLimit} remaining today
            </span>
          ) : (
            <span className="text-yellow-200">Daily limit reached - resets tomorrow</span>
          )}
        </div>
      )}
    </Link>
  );
}
