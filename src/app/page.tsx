'use client';

import Link from "next/link";
import { Brain, MessageSquare, Target, Mic, Video, ArrowRight, Users, Clock, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-semibold text-slate-900 dark:text-white">
                  InterviewAI
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/auth/login"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Master Your Next
            <span className="block text-blue-600">Interview</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400">
            Practice with our AI interviewer. Get real-time feedback, improve your skills, 
            and boost your confidence for any interview scenario.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg transition-colors"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Start Practicing Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-lg font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">1,000+</div>
              <div className="text-slate-600 dark:text-slate-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">95%</div>
              <div className="text-slate-600 dark:text-slate-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">24/7</div>
              <div className="text-slate-600 dark:text-slate-400">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              AI-Powered Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience the future of interview preparation with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Smart AI Interviewer",
                description: "Advanced conversational AI that adapts to your responses and provides realistic interview scenarios"
              },
              {
                icon: MessageSquare,
                title: "Real-time Feedback",
                description: "Get instant analysis of your responses with detailed improvement suggestions and scoring"
              },
              {
                icon: Target,
                title: "Personalized Practice",
                description: "Tailored interview questions based on your industry, role, and experience level"
              },
              {
                icon: Mic,
                title: "Voice & Text Support",
                description: "Practice with both voice and text responses for comprehensive interview preparation"
              },
              {
                icon: Video,
                title: "Multiple Scenarios",
                description: "Technical, behavioral, and situational interviews across various industries"
              },
              {
                icon: Clock,
                title: "Performance Analytics",
                description: "Track your progress with detailed analytics and performance insights over time"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-slate-700 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of successful candidates who improved their interview skills with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 text-lg font-medium rounded-lg transition-colors"
            >
              <Brain className="h-5 w-5 mr-2" />
              Start Free Trial
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg font-medium rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-lg font-semibold text-white">InterviewAI</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2024 InterviewAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
