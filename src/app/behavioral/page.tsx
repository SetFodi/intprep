'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Brain, Users, Clock, Send, RotateCcw, Star, TrendingUp, MessageSquare } from 'lucide-react';
import { generateAIFeedback } from '@/utils/aiFeedback';

interface AIFeedback {
  strengths: string[];
  improvements: string[];
  starScore: number;
}

const sampleQuestions = [
  {
    id: 1,
    question: "Tell me about a time when you had to lead a team through a difficult project.",
    category: "Leadership",
    tips: [
      "Use the STAR method (Situation, Task, Action, Result)",
      "Focus on your specific actions and decisions",
      "Quantify the results when possible",
      "Show how you motivated and guided your team"
    ]
  },
  {
    id: 2,
    question: "Describe a situation where you had to work with a difficult team member.",
    category: "Teamwork",
    tips: [
      "Show empathy and understanding",
      "Explain how you tried to understand their perspective",
      "Describe the steps you took to improve the relationship",
      "Focus on the positive outcome"
    ]
  },
  {
    id: 3,
    question: "Tell me about a time when you had to solve a complex problem with limited resources.",
    category: "Problem Solving",
    tips: [
      "Clearly define the problem",
      "Explain your analytical approach",
      "Show creativity in finding solutions",
      "Demonstrate resourcefulness"
    ]
  },
  {
    id: 4,
    question: "Describe a time when you had to communicate a complex technical concept to non-technical stakeholders.",
    category: "Communication",
    tips: [
      "Show how you adapted your communication style",
      "Explain the techniques you used to simplify concepts",
      "Demonstrate active listening",
      "Highlight the successful outcome"
    ]
  }
];

export default function BehavioralPage() {
  const [currentQuestion, setCurrentQuestion] = useState(sampleQuestions[0]);
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const handleQuestionChange = (question: typeof sampleQuestions[0]) => {
    setCurrentQuestion(question);
    setResponse('');
    setFeedback(null);
    setStartTime(null);
    setTimeSpent(0);
  };

  const handleResponseChange = (value: string) => {
    if (!startTime) {
      setStartTime(new Date());
    }
    setResponse(value);
  };

  const submitResponse = async () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    
    // Calculate time spent
    if (startTime) {
      const endTime = new Date();
      const timeSpentSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      setTimeSpent(timeSpentSeconds);
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const aiFeedback = generateAIFeedback(response, currentQuestion.category);
    setFeedback(aiFeedback);
    setIsSubmitting(false);
  };

  const resetResponse = () => {
    setResponse('');
    setFeedback(null);
    setStartTime(null);
    setTimeSpent(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Behavioral
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Selection and Tips */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Behavioral Questions</h2>
              
              {/* Question List */}
              <div className="space-y-2 mb-6">
                {sampleQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionChange(question)}
                    className={`w-full text-left p-3 rounded-md text-sm transition-colors ${
                      question.id === currentQuestion.id
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <div className="font-medium mb-1">{question.category}</div>
                    <div className="text-gray-600 text-xs line-clamp-2">
                      {question.question}
                    </div>
                  </button>
                ))}
              </div>

              {/* Current Question */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {currentQuestion.category}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Current Question</h3>
                <p className="text-gray-700 text-sm">{currentQuestion.question}</p>
              </div>

              {/* Tips */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  Tips for Success
                </h3>
                <ul className="space-y-2">
                  {currentQuestion.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* STAR Method Reminder */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">STAR Method</h4>
                <div className="text-xs text-yellow-700 space-y-1">
                  <div><strong>S</strong>ituation: Set the context</div>
                  <div><strong>T</strong>ask: Describe your responsibility</div>
                  <div><strong>A</strong>ction: Explain what you did</div>
                  <div><strong>R</strong>esult: Share the outcome</div>
                </div>
              </div>
            </div>
          </div>

          {/* Response Area and Feedback */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Your Response</h3>
                  <div className="flex items-center space-x-4">
                    {startTime && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))}
                      </div>
                    )}
                    <button
                      onClick={resetResponse}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <textarea
                    value={response}
                    onChange={(e) => handleResponseChange(e.target.value)}
                    placeholder="Type your response here... Remember to use the STAR method!"
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {response.length} characters • {response.trim().split(/\s+/).length} words
                    </span>
                    <button
                      onClick={submitResponse}
                      disabled={!response.trim() || isSubmitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Get Feedback
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Feedback */}
                {feedback && (
                  <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-500">STAR Score:</div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            feedback?.starScore >= 80 ? 'bg-green-100 text-green-800' :
                            feedback?.starScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {feedback?.starScore || 0}/100
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Strengths
                          </h4>
                          <ul className="space-y-2">
                            {feedback?.strengths.map((strength, index) => (
                              <li key={index} className="text-sm text-green-700 flex items-start">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Areas for Improvement */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-2">
                            {feedback?.improvements.map((improvement, index) => (
                              <li key={index} className="text-sm text-blue-700 flex items-start">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Tips for Next Time */}
                      <div className="mt-6 bg-purple-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Tips for Next Time
                        </h4>
                        <div className="text-sm text-purple-700">
                          <p className="mb-2">Remember to:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Use specific examples and metrics</li>
                            <li>Structure your response using the STAR method</li>
                            <li>Focus on your personal actions and impact</li>
                            <li>Keep responses concise but detailed</li>
                          </ul>
                        </div>
                      </div>
                    </div>
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
