'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Code, Users, TrendingUp, Clock, Award, Brain, Play, BookOpen } from "lucide-react";

interface UserStats {
  totalChallengesCompleted: number;
  totalBehavioralCompleted: number;
  averageTimePerChallenge: number;
  averageScore: number;
  streakDays: number;
  lastActivity: Date;
}

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats>({
    totalChallengesCompleted: 12,
    totalBehavioralCompleted: 8,
    averageTimePerChallenge: 25,
    averageScore: 78,
    streakDays: 5,
    lastActivity: new Date(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Brain className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">InterviewPrep</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/coding"
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Coding
                </Link>
                <Link
                  href="/behavioral"
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Behavioral
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-600">Ready to continue your interview preparation journey?</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Code className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Coding Challenges
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalChallengesCompleted}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Behavioral Questions
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalBehavioralCompleted}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Average Score
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.averageScore}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Streak Days
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.streakDays}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/coding"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                  <Code className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Practice Coding
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Solve coding challenges with our built-in editor and get instant feedback.
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <Play className="h-6 w-6" />
              </span>
            </Link>

            <Link
              href="/behavioral"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <Users className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Behavioral Practice
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Practice behavioral questions and get AI-powered feedback on your responses.
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <BookOpen className="h-6 w-6" />
              </span>
            </Link>

            <div className="relative group bg-white p-6 rounded-lg shadow">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                  <TrendingUp className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">View Progress</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Track your improvement with detailed analytics and performance insights.
                </p>
              </div>
              <span className="text-sm text-gray-400 mt-4 block">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              <li className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="h-5 w-5 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Two Sum Problem</p>
                      <p className="text-sm text-gray-500">Completed with 85% score</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Leadership Question</p>
                      <p className="text-sm text-gray-500">Practiced STAR method</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">1 day ago</div>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="h-5 w-5 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Reverse String</p>
                      <p className="text-sm text-gray-500">Completed with 92% score</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">2 days ago</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
