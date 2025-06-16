'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { generateAIResponse } from '@/utils/aiResponses';
import { Brain, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AIInterview() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usageData, setUsageData] = useState<{ daily_interviews: number; last_interview_date: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Load persisted state on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('ai-interview-messages');
      const savedInterviewStarted = localStorage.getItem('ai-interview-started');
      const savedSessionId = localStorage.getItem('ai-interview-session-id');
      
      if (savedMessages && savedInterviewStarted === 'true') {
        try {
          setMessages(JSON.parse(savedMessages));
          setInterviewStarted(true);
          setSessionId(savedSessionId);
        } catch (error) {
          console.error('Error loading saved interview state:', error);
          // Clear corrupted data
          localStorage.removeItem('ai-interview-messages');
          localStorage.removeItem('ai-interview-started');
          localStorage.removeItem('ai-interview-session-id');
        }
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (interviewStarted && messages.length > 0) {
        localStorage.setItem('ai-interview-messages', JSON.stringify(messages));
        localStorage.setItem('ai-interview-started', 'true');
        if (sessionId) {
          localStorage.setItem('ai-interview-session-id', sessionId);
        }
      } else if (!interviewStarted) {
        localStorage.removeItem('ai-interview-messages');
        localStorage.removeItem('ai-interview-started');
        localStorage.removeItem('ai-interview-session-id');
      }
    }
  }, [messages, interviewStarted, sessionId]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?from=/ai-interview');
      return;
    }
    
    if (status === 'authenticated') {
      fetchUsage();
    }
  }, [status, router]);

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/user/usage');
      if (response.ok) {
        const data = await response.json();
        setUsageData(data);
      } else {
        console.error('Failed to fetch usage data');
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = () => {
    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);
    setInterviewStarted(true);
    setMessages([
      {
        role: 'assistant',
        content: "Hi! I'm your AI interview coach. I'll be conducting a mock interview today. Let's start with a brief introduction. Could you tell me about yourself and your background?"
      }
    ]);
  };

  const endInterview = () => {
    setInterviewStarted(false);
    setMessages([]);
    setSessionId(null);
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai-interview-messages');
      localStorage.removeItem('ai-interview-started');
      localStorage.removeItem('ai-interview-session-id');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Update usage count and track activity
      const usageResponse = await fetch('/api/user/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          action: 'message_sent'
        }),
      });
      
      if (usageResponse.status === 429) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'm sorry, but you've reached your daily limit for AI interviews. Please try again tomorrow!"
        }]);
        setIsLoading(false);
        return;
      }

      const prompt = `You are an AI interview coach conducting a mock interview. The candidate has responded: "${userMessage}". Please provide a professional and constructive response, including a brief analysis of their answer and a relevant follow-up question. Keep responses concise and helpful.`;
      const response = await generateAIResponse(prompt);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      
      // Track the interview activity
      await fetch('/api/user/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'ai_interview',
          category: 'behavioral',
          sessionId,
          details: 'AI Interview Message Exchange',
          messageCount: messages.length + 2, // +1 for user message, +1 for AI response
        }),
      });
      
      // Refresh usage data
      fetchUsage();
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble generating a response right now. Could you please try rephrasing your answer?"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication or fetching data
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const remainingInterviews = usageData ? 10 - usageData.daily_interviews : 10;

  // Show limit reached page
  if (remainingInterviews <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Daily Limit Reached</h1>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            You&apos;ve used all 10 free AI interviews for today. Your limit will reset tomorrow.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Why the limit?</strong> AI interviews use expensive cloud services. 
              This helps us keep the platform free while managing costs.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/coding')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
            >
              Practice Coding Instead
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 py-3 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-600 p-3 rounded-lg mr-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">AI Interview Practice</h1>
                <p className="text-gray-600 dark:text-slate-400">Remaining interviews today: {remainingInterviews}</p>
              </div>
            </div>
          </div>
        </div>

        {!interviewStarted ? (
          /* Interview Start Screen */
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready for Your AI Interview?</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Our AI coach will conduct a personalized mock interview session. You'll receive real-time feedback 
              and constructive analysis to help improve your interview skills.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Behavioral Questions</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">Practice common behavioral interview questions</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Feedback</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">Get instant analysis and improvement tips</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Track Progress</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">Monitor your improvement over time</p>
              </div>
            </div>
            
            <button
              onClick={startInterview}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium text-lg"
            >
              Start Interview
            </button>
          </div>
        ) : (
          /* Interview Chat Interface */
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-900">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl px-4 py-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-slate-200 dark:border-slate-600'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-700 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Form */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <Send className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={endInterview}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  End Interview
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
