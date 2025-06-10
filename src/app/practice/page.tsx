'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Brain, Target, Users, Code, Briefcase, MessageSquare, Play, Clock, Star } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const PRACTICE_SCENARIOS = [
  {
    id: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Practice common behavioral questions with STAR method guidance',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    duration: '15-30 min',
    difficulty: 'Beginner',
    questions: [
      'Tell me about a time when you had to work with a difficult team member.',
      'Describe a situation where you had to meet a tight deadline.',
      'Give me an example of a time you showed leadership.',
      'Tell me about a mistake you made and how you handled it.',
      'Describe a time when you had to learn something new quickly.'
    ]
  },
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Technical problem-solving and system design questions',
    icon: Code,
    color: 'from-purple-500 to-pink-500',
    duration: '30-45 min',
    difficulty: 'Intermediate',
    questions: [
      'How would you design a URL shortening service like bit.ly?',
      'Explain the difference between SQL and NoSQL databases.',
      'How would you optimize a slow-performing web application?',
      'Describe your approach to testing a new feature.',
      'How would you handle a system that needs to scale to millions of users?'
    ]
  },
  {
    id: 'leadership',
    title: 'Leadership Interview',
    description: 'Management and leadership scenario discussions',
    icon: Briefcase,
    color: 'from-green-500 to-teal-500',
    duration: '20-35 min',
    difficulty: 'Advanced',
    questions: [
      'How do you motivate a team member who is underperforming?',
      'Describe your approach to giving constructive feedback.',
      'How would you handle a conflict between two team members?',
      'Tell me about a time you had to make a difficult decision.',
      'How do you prioritize tasks when everything seems urgent?'
    ]
  },
  {
    id: 'situational',
    title: 'Situational Judgment',
    description: 'Real-world scenarios and problem-solving challenges',
    icon: Target,
    color: 'from-orange-500 to-red-500',
    duration: '25-40 min',
    difficulty: 'Intermediate',
    questions: [
      'A client is unhappy with a deliverable. How do you handle it?',
      'You discover a security vulnerability in production. What do you do?',
      'Your team is behind schedule on a critical project. How do you respond?',
      'A stakeholder requests a feature that goes against best practices. How do you handle it?',
      'You need to present technical information to non-technical executives. How do you approach it?'
    ]
  }
];

export default function PracticePage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const scenario = PRACTICE_SCENARIOS.find(s => s.id === selectedScenario);

  const generateFeedback = (response: string) => {
    const wordCount = response.trim().split(/\s+/).length;
    let score = 70;
    
    if (wordCount < 30) score -= 20;
    else if (wordCount > 200) score -= 10;
    else if (wordCount >= 50 && wordCount <= 150) score += 15;
    
    const lowerResponse = response.toLowerCase();
    const suggestions = [];
    
    if (!lowerResponse.includes('i ')) suggestions.push('Use more first-person examples');
    if (wordCount < 40) suggestions.push('Provide more specific details');
    if (!lowerResponse.includes('result') && !lowerResponse.includes('outcome')) {
      suggestions.push('Always mention the outcome or result');
    }
    
    return {
      score: Math.max(0, Math.min(100, score)),
      feedback: `Your response demonstrates ${score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'developing'} communication skills.`,
      suggestions
    };
  };

  const submitResponse = () => {
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (scenario && currentQuestion < scenario.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setUserResponse('');
      setShowFeedback(false);
    }
  };

  const resetPractice = () => {
    setSelectedScenario(null);
    setCurrentQuestion(0);
    setUserResponse('');
    setShowFeedback(false);
  };

  if (!selectedScenario) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-700/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Practice Mode
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Practice Scenario
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select an interview type to practice with AI-powered feedback and realistic scenarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRACTICE_SCENARIOS.map((scenario) => {
              const IconComponent = scenario.icon;
              return (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className="relative group cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${scenario.color} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300`}></div>
                  <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <div className={`flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r ${scenario.color} text-white mx-auto mb-6`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                      {scenario.title}
                    </h3>
                    
                    <p className="text-gray-600 text-center mb-6">
                      {scenario.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {scenario.duration}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {scenario.difficulty}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${scenario.color} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Practice
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                {scenario?.title}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={resetPractice}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                Back to Scenarios
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Interface */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Progress */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Question {currentQuestion + 1} of {scenario?.questions.length}</h2>
              <div className="text-sm opacity-90">
                {scenario?.difficulty} • {scenario?.duration}
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / (scenario?.questions.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {scenario?.questions[currentQuestion]}
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Tip:</strong> Use the STAR method (Situation, Task, Action, Result) to structure your response. 
                  Be specific and provide concrete examples.
                </p>
              </div>
            </div>

            {/* Response Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response
              </label>
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Type your response here... Remember to be specific and use examples."
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <div className="mt-2 text-sm text-gray-500">
                {userResponse.length} characters • {userResponse.trim().split(/\s+/).length} words
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={submitResponse}
                disabled={!userResponse.trim() || showFeedback}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Get Feedback
              </button>
              
              {showFeedback && (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  {currentQuestion < (scenario?.questions.length || 1) - 1 ? 'Next Question' : 'Complete Practice'}
                </button>
              )}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  AI Feedback
                </h4>
                
                {(() => {
                  const feedback = generateFeedback(userResponse);
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">Score</span>
                        <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                          feedback.score >= 80 ? 'bg-green-100 text-green-800' :
                          feedback.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {feedback.score}/100
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{feedback.feedback}</p>
                      
                      {feedback.suggestions.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Suggestions for improvement:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            {feedback.suggestions.map((suggestion, idx) => (
                              <li key={idx}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
