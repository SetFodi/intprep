'use client';

import Link from "next/link";
import { Brain, MessageSquare, Zap, Target, Mic, Video, ArrowRight, Star, Users, Clock, TrendingUp, Shield, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  InterviewAI
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <Link
                href="/auth/login"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-sm"></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 text-blue-800 dark:text-blue-200 text-sm font-semibold mb-6 shadow-lg">
              <Sparkles className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              AI-Powered Interview Practice
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
            <span className="block">Master Your Next</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Interview
            </span>
          </h1>
          
          <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Practice with our advanced AI interviewer. Get real-time feedback, improve your skills, 
            and boost your confidence for any interview scenario.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/register"
              className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <MessageSquare className="h-6 w-6 mr-3" />
              Start Practicing Now
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-lg font-semibold rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Target className="h-6 w-6 mr-3" />
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">10,000+</div>
              <div className="text-slate-600 dark:text-slate-400">Active Users</div>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">95%</div>
              <div className="text-slate-600 dark:text-slate-400">Success Rate</div>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">24/7</div>
              <div className="text-slate-600 dark:text-slate-400">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-24 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              AI-Powered Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Experience the future of interview preparation with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Smart AI Interviewer",
                description: "Advanced conversational AI that adapts to your responses and provides realistic interview scenarios",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: MessageSquare,
                title: "Real-time Feedback",
                description: "Get instant analysis of your responses with detailed improvement suggestions and scoring",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Target,
                title: "Personalized Practice",
                description: "Tailored interview questions based on your industry, role, and experience level",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Mic,
                title: "Voice & Text Support",
                description: "Practice with both voice and text responses for comprehensive interview preparation",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: Video,
                title: "Multiple Scenarios",
                description: "Technical, behavioral, and situational interviews across various industries",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                icon: Zap,
                title: "Performance Analytics",
                description: "Track your progress with detailed analytics and performance insights over time",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-8 rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mx-auto mb-6 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center py-24 px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12 leading-relaxed">
            Join thousands of successful candidates who improved their interview skills with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/register"
              className="group inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Brain className="h-6 w-6 mr-3" />
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg font-semibold rounded-2xl transition-all duration-300"
            >
              <Target className="h-6 w-6 mr-3" />
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold text-white">InterviewAI</span>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed">
                Revolutionizing interview preparation with AI-powered practice sessions, 
                real-time feedback, and personalized learning experiences.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 InterviewAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
