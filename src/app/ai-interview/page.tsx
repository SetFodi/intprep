'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Brain, Send, Mic, MicOff, RotateCcw, Home, MessageSquare } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  analysis?: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
}

const AI_FARTE_RESPONSES = {
  greeting: [
    "Hello! I'm AI Farte, your premium interview coach. I've analyzed thousands of successful interviews and I'm here to help you excel. Let's begin with a fundamental question - could you walk me through your professional journey and what specifically draws you to this type of role?",
    "Welcome! I'm AI Farte, and I'll be conducting your interview simulation today. I use advanced behavioral analysis to provide insights that mirror real hiring manager perspectives. To start, I'd love to understand your background - what's your story, and what motivates you in your career?",
    "Greetings! AI Farte here - your intelligent interview partner. I've been trained on successful interview patterns from top companies. Let's dive deep - tell me about yourself, but focus on the experiences that have shaped your professional identity and aspirations.",
    "Hi there! I'm AI Farte, your AI interview specialist. I combine natural language processing with real-world hiring insights to give you the most realistic practice possible. Let's start with the classic opener - but I want you to think strategically about how you position yourself. What's your elevator pitch?"
  ],
  
  followUps: {
    introduction: [
      "Fascinating background! I'm particularly intrigued by [specific detail]. Let me dig deeper - can you walk me through a specific project or achievement that you feel truly showcases your capabilities? I want to understand not just what you did, but how you think.",
      "That's a compelling narrative. Now, I'm curious about your decision-making process. Can you describe a time when you had to make a significant professional decision with limited information? How did you approach it?",
      "Excellent foundation. I can see you have strong experience. Let me challenge you a bit - what would you say is your biggest professional weakness, and more importantly, how are you actively working to address it?",
      "I appreciate that overview. Now let's get specific - tell me about a time when you failed at something important. What happened, what did you learn, and how did it change your approach going forward?"
    ],

    technical: [
      "That's a thoughtful approach. Let me push you further - imagine you're presenting this solution to a skeptical CTO who's concerned about scalability and cost. How would you address their concerns and what trade-offs would you highlight?",
      "Interesting perspective. Now, let's say this solution is in production and suddenly starts failing under load. Walk me through your debugging process - what's your systematic approach to identifying and resolving the issue?",
      "I like your thinking. But here's a curveball - what if you had to implement this same solution with half the timeline and budget? How would you prioritize and what would you sacrifice?",
      "Solid reasoning. Now, imagine you're mentoring a junior developer who proposed a completely different approach. How would you evaluate their solution and provide constructive feedback?"
    ],

    behavioral: [
      "That's a compelling example. I can see you handled it well. But let me probe deeper - what was going through your mind during the most challenging moment? How did you manage your own emotions while leading others?",
      "Excellent story. Now I'm curious about the aftermath - how did you measure the success of your approach? And looking back, what would you do differently if you faced a similar situation today?",
      "That demonstrates strong problem-solving skills. But I want to understand your interpersonal approach better - how did you ensure all stakeholders felt heard and valued throughout this process?",
      "Great example of resilience. Now, tell me about the ripple effects - how did this experience influence your leadership style, and can you give me an example of how you've applied those lessons since?"
    ],

    leadership: [
      "That's insightful leadership thinking. Let me challenge you with a scenario - you have a high-performing team member who's becoming toxic to team morale. They deliver results but their attitude is affecting others. How do you handle this delicate situation?",
      "Excellent approach. Now, imagine you're leading a team through a major organizational change that you personally disagree with. How do you maintain team morale and buy-in while staying authentic to your own values?",
      "That shows emotional intelligence. Here's a tough one - you need to deliver disappointing news to your team (budget cuts, project cancellation, layoffs). How do you approach this conversation while maintaining trust and motivation?",
      "Strong leadership philosophy. Let me test it - you have two equally qualified team members competing for a promotion, but you can only choose one. How do you make this decision and handle the aftermath with both individuals?"
    ]
  },
  
  deepDive: [
    "Let's dig deeper into that. I want to understand your cognitive process here - can you walk me through your thought process step by step? What frameworks or mental models did you use?",
    "That's fascinating, and I can see the complexity involved. What was the most challenging part of that situation, and how did you know you were making the right decisions in real-time?",
    "I'm curious about the metrics and impact. How did you measure the success of that initiative? What were the quantifiable outcomes, and how did you track progress along the way?",
    "Can you elaborate on that? I want to understand the specifics - what exact actions did you take, what was your timeline, and how did you ensure accountability throughout the process?"
  ],

  closing: [
    "This has been an excellent conversation - your responses show real depth of thinking and experience. Before we wrap up, I'm curious: what questions do you have about the role, the team dynamics, or the company culture?",
    "I'm impressed by the thoughtfulness of your answers and the way you've structured your responses. Is there anything else about your experience or approach that you feel would be important for me to understand?",
    "Thank you for such engaging and detailed responses. You've given me great insight into how you think and operate. What questions can I answer for you about what we've discussed or about next steps?",
    "I appreciate the depth you've brought to this conversation. Your examples really demonstrate your capabilities well. Before we conclude, what would you like to know about the challenges and opportunities in this role?"
  ]
};

export default function AIInterviewPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interviewStage, setInterviewStage] = useState<'greeting' | 'introduction' | 'technical' | 'behavioral' | 'leadership' | 'closing'>('greeting');
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start with AI Farte greeting
    const greeting = AI_FARTE_RESPONSES.greeting[Math.floor(Math.random() * AI_FARTE_RESPONSES.greeting.length)];
    setMessages([{
      id: '1',
      type: 'ai',
      content: greeting,
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const analyzeResponse = (response: string, stage: string): { score: number; feedback: string; suggestions: string[] } => {
    const wordCount = response.trim().split(/\s+/).length;
    let score = 70; // Base score
    
    // Length analysis
    if (wordCount < 20) score -= 20;
    else if (wordCount > 200) score -= 10;
    else if (wordCount >= 50 && wordCount <= 150) score += 15;
    
    // Content analysis based on stage
    const lowerResponse = response.toLowerCase();
    const suggestions: string[] = [];
    let feedback = '';
    
    if (stage === 'introduction') {
      if (lowerResponse.includes('experience') || lowerResponse.includes('background')) score += 10;
      if (lowerResponse.includes('passion') || lowerResponse.includes('excited')) score += 5;
      feedback = 'Good introduction. ';
      if (wordCount < 30) suggestions.push('Try to provide more detail about your background');
      if (!lowerResponse.includes('experience')) suggestions.push('Mention relevant experience');
    } else if (stage === 'behavioral') {
      if (lowerResponse.includes('situation') || lowerResponse.includes('challenge')) score += 10;
      if (lowerResponse.includes('result') || lowerResponse.includes('outcome')) score += 10;
      if (lowerResponse.includes('learned') || lowerResponse.includes('improved')) score += 5;
      feedback = 'Nice behavioral example. ';
      if (!lowerResponse.includes('result')) suggestions.push('Always mention the outcome or result');
      if (wordCount < 40) suggestions.push('Provide more context and details');
    } else if (stage === 'technical') {
      if (lowerResponse.includes('approach') || lowerResponse.includes('solution')) score += 10;
      if (lowerResponse.includes('consider') || lowerResponse.includes('alternative')) score += 5;
      feedback = 'Solid technical thinking. ';
      if (!lowerResponse.includes('because') && !lowerResponse.includes('reason')) {
        suggestions.push('Explain your reasoning behind decisions');
      }
    }
    
    // General improvements
    if (wordCount < 25) suggestions.push('Elaborate more on your answer');
    if (!lowerResponse.includes('i ')) suggestions.push('Use more first-person examples');
    
    score = Math.max(0, Math.min(100, score));
    
    return {
      score,
      feedback: feedback + `Your response demonstrates ${score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'developing'} communication skills.`,
      suggestions
    };
  };

  const generateAIResponse = (userMessage: string, stage: string): string => {
    const responses = AI_FARTE_RESPONSES.followUps[stage as keyof typeof AI_FARTE_RESPONSES.followUps] || AI_FARTE_RESPONSES.deepDive;

    // Enhanced keyword-based response selection with context awareness
    const lowerMessage = userMessage.toLowerCase();
    const wordCount = userMessage.trim().split(/\s+/).length;

    // AI Farte provides more sophisticated responses based on response quality
    if (wordCount > 100) {
      // Detailed response gets deeper follow-up
      return AI_FARTE_RESPONSES.deepDive[Math.floor(Math.random() * AI_FARTE_RESPONSES.deepDive.length)];
    }

    if (lowerMessage.includes('project') || lowerMessage.includes('built') || lowerMessage.includes('developed')) {
      setInterviewStage('technical');
      return AI_FARTE_RESPONSES.followUps.technical[Math.floor(Math.random() * AI_FARTE_RESPONSES.followUps.technical.length)];
    }

    if (lowerMessage.includes('team') || lowerMessage.includes('collaboration') || lowerMessage.includes('led') || lowerMessage.includes('managed')) {
      setInterviewStage('leadership');
      return AI_FARTE_RESPONSES.followUps.leadership[Math.floor(Math.random() * AI_FARTE_RESPONSES.followUps.leadership.length)];
    }

    if (lowerMessage.includes('challenge') || lowerMessage.includes('difficult') || lowerMessage.includes('problem') || lowerMessage.includes('conflict')) {
      setInterviewStage('behavioral');
      return AI_FARTE_RESPONSES.followUps.behavioral[Math.floor(Math.random() * AI_FARTE_RESPONSES.followUps.behavioral.length)];
    }

    if (questionCount >= 5) {
      setInterviewStage('closing');
      return AI_FARTE_RESPONSES.closing[Math.floor(Math.random() * AI_FARTE_RESPONSES.closing.length)];
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async () => {
    if (!currentInput.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date(),
      analysis: analyzeResponse(currentInput, interviewStage)
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentInput, interviewStage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setQuestionCount(prev => prev + 1);
      
      // Progress interview stages
      if (interviewStage === 'greeting') setInterviewStage('introduction');
      else if (interviewStage === 'introduction' && questionCount >= 1) setInterviewStage('technical');
      else if (interviewStage === 'technical' && questionCount >= 2) setInterviewStage('behavioral');
    }, 1500 + Math.random() * 1000);
  };

  const resetInterview = () => {
    setMessages([]);
    setCurrentInput('');
    setQuestionCount(0);
    setInterviewStage('greeting');
    
    // Restart with AI Farte greeting
    setTimeout(() => {
      const greeting = AI_FARTE_RESPONSES.greeting[Math.floor(Math.random() * AI_FARTE_RESPONSES.greeting.length)];
      setMessages([{
        id: '1',
        type: 'ai',
        content: greeting,
        timestamp: new Date()
      }]);
    }, 500);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                AI Farte Interview
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={resetInterview}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </button>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-md'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  {message.analysis && (
                    <div className="mt-3 pt-3 border-t border-purple-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">AI Analysis</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          message.analysis.score >= 80 ? 'bg-green-200 text-green-800' :
                          message.analysis.score >= 60 ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {message.analysis.score}/100
                        </span>
                      </div>
                      <p className="text-xs mb-2">{message.analysis.feedback}</p>
                      {message.analysis.suggestions.length > 0 && (
                        <div className="text-xs">
                          <p className="font-medium mb-1">Suggestions:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {message.analysis.suggestions.map((suggestion, idx) => (
                              <li key={idx}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-3 rounded-2xl shadow-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-600 p-4 bg-white dark:bg-gray-800">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Type your response here... (Press Enter to send)"
                  className="form-textarea"
                  rows={3}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={sendMessage}
                  disabled={!currentInput.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`px-6 py-3 rounded-xl transition-colors ${
                    isListening 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Progress */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Interview Stage: <span className="capitalize text-purple-600">{interviewStage}</span>
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Questions: {questionCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
