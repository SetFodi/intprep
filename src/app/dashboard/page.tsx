'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Brain, MessageSquare, Target, TrendingUp, Clock, Award, Zap, Play } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface UserStats {
  aiInterviewsCompleted: number;
  practiceSessionsCompleted: number;
  averageScore: number;
  totalTimeSpent: number;
  streakDays: number;
  lastActivity: Date;
}

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats>({
    aiInterviewsCompleted: 7,
    practiceSessionsCompleted: 15,
    averageScore: 82,
    totalTimeSpent: 180, // minutes
    streakDays: 3,
    lastActivity: new Date(),
  });

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  AI Farte
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-purple-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/ai-interview"
                  className="border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  AI Interview
                </Link>
                <Link
                  href="/practice"
                  className="border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Practice
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-8 sm:px-0">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
                <p className="text-purple-100">Ready to practice with your AI interviewer?</p>
              </div>
              <div className="hidden sm:block">
                <Brain className="h-16 w-16 text-purple-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-white/20">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">
                      AI Interviews
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats.aiInterviewsCompleted}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-white/20">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">
                      Practice Sessions
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats.practiceSessionsCompleted}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-white/20">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">
                      Average Score
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats.averageScore}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-white/20">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">
                      Streak Days
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats.streakDays}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Start Your Practice</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Link
              href="/ai-interview"
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white mx-auto mb-6">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  AI Interview Session
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Have a realistic conversation with our AI interviewer. Get dynamic questions and instant feedback.
                </p>
                <div className="text-center">
                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium">
                    <Play className="h-4 w-4 mr-2" />
                    Start AI Interview
                  </span>
                </div>
              </div>
            </Link>

            <Link
              href="/practice"
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white mx-auto mb-6">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Practice Mode
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Choose specific interview scenarios and practice with structured feedback and scoring.
                </p>
                <div className="text-center">
                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium">
                    <Target className="h-4 w-4 mr-2" />
                    Choose Scenario
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden rounded-xl border border-white/20">
            <ul className="divide-y divide-gray-200">
              <li className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mr-4">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">AI Interview Session</p>
                      <p className="text-sm text-gray-500">Behavioral questions • Score: 87%</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg mr-4">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Leadership Practice</p>
                      <p className="text-sm text-gray-500">Completed 5 questions • Score: 82%</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">1 day ago</div>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-4">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Technical Interview</p>
                      <p className="text-sm text-gray-500">System design questions • Score: 79%</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">2 days ago</div>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mr-4">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">AI Interview Session</p>
                      <p className="text-sm text-gray-500">Mixed scenarios • Score: 85%</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">3 days ago</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
