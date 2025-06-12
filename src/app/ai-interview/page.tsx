'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Brain, Send, Mic, MicOff, RotateCcw, Home, MessageSquare } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { generateAIResponse, getCachedResponse, cacheResponse } from '@/utils/aiResponses';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  analysis?: {
    starScore: number;
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
  const [timeSpent, setTimeSpent] = useState(0);
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

  const analyzeResponse = (response: string, stage: string): { starScore: number; feedback: string; suggestions: string[] } => {
    const wordCount = response.trim().split(/\s+/).length;
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const lowerResponse = response.toLowerCase();
    const suggestions: string[] = [];

    // Start with base score
    let starScore = 60;

    // Length scoring (more nuanced)
    if (wordCount < 10) {
      starScore = 25;
      suggestions.push('Your response is too brief. Provide much more detail and specific examples.');
    } else if (wordCount < 25) {
      starScore = 40;
      suggestions.push('Expand your response with more specific details and examples.');
    } else if (wordCount >= 30 && wordCount <= 150) {
      starScore += 25; // Good length bonus
    } else if (wordCount > 150) {
      starScore += 15; // Still good for detailed responses
    }

    // Big bonus for detailed responses with projects
    if (wordCount > 80) {
      starScore += 10;
    }

    // Technical response analysis
    if (stage === 'technical' || stage === 'introduction') {
      const hasProjects = lowerResponse.includes('project') || lowerResponse.includes('built') ||
                         lowerResponse.includes('created') || lowerResponse.includes('developed') ||
                         lowerResponse.includes('.com') || lowerResponse.includes('.live') ||
                         lowerResponse.includes('platform') || lowerResponse.includes('website');

      if (hasProjects) {
        starScore += 25; // Big bonus for mentioning actual projects
      }

      // Check for specific project details
      const projectDetails = ['syncrolly', 'typingy', 'andwatch', 'codeshare', 'typing race',
                             'myanimelist', 'simultaneously', 'real-time', 'collaborative', 'platform',
                             'room', 'board', 'save', 'track', 'follow', 'movies', 'tv shows', 'animes'];
      const detailsMentioned = projectDetails.filter(detail => lowerResponse.includes(detail));
      starScore += detailsMentioned.length * 6; // Increased bonus for project details

      if (lowerResponse.includes('approach') || lowerResponse.includes('solution') || lowerResponse.includes('implement')) {
        starScore += 15;
      } else if (stage === 'technical') {
        suggestions.push('Describe your approach or solution methodology');
      }

      if (lowerResponse.includes('because') || lowerResponse.includes('reason') || lowerResponse.includes('why')) {
        starScore += 10;
      } else if (stage === 'technical') {
        suggestions.push('Explain your reasoning behind technical decisions');
      }

      if (lowerResponse.includes('performance') || lowerResponse.includes('optimize') || lowerResponse.includes('scale')) {
        starScore += 12;
      }
    }

    // Behavioral response analysis
    if (stage === 'behavioral') {
      // STAR method analysis
      const starComponents = {
        situation: ['situation', 'context', 'when', 'where', 'background'].some(word => lowerResponse.includes(word)),
        task: ['task', 'responsibility', 'goal', 'objective', 'needed to'].some(word => lowerResponse.includes(word)),
        action: ['action', 'did', 'implemented', 'decided', 'approached'].some(word => lowerResponse.includes(word)),
        result: ['result', 'outcome', 'achieved', 'improved', 'success'].some(word => lowerResponse.includes(word))
      };

      const starMethodScore = Object.values(starComponents).filter(Boolean).length;
      starScore += starMethodScore * 8;

      if (!starComponents.situation) suggestions.push('Set the context/situation more clearly');
      if (!starComponents.task) suggestions.push('Explain your specific role and responsibilities');
      if (!starComponents.action) suggestions.push('Describe the specific actions you took');
      if (!starComponents.result) suggestions.push('Always mention the outcome or results');

      if (lowerResponse.includes('learned') || lowerResponse.includes('grew') || lowerResponse.includes('improved')) {
        starScore += 10;
      } else {
        suggestions.push('Mention what you learned from the experience');
      }
    }

    // Leadership response analysis
    if (stage === 'leadership') {
      if (lowerResponse.includes('team') || lowerResponse.includes('led') || lowerResponse.includes('managed')) {
        starScore += 15;
      }
      if (lowerResponse.includes('influence') || lowerResponse.includes('motivate') || lowerResponse.includes('inspire')) {
        starScore += 12;
      }
      if (lowerResponse.includes('conflict') || lowerResponse.includes('challenge') || lowerResponse.includes('difficult')) {
        starScore += 10;
      }
    }

    // General quality indicators
    if (sentences.length >= 3) {
      starScore += 8;
    } else {
      suggestions.push('Structure your response with multiple supporting points');
    }

    // Generate feedback based on score
    let feedback = '';
    if (starScore >= 85) {
      feedback = 'Excellent response! You provided detailed, specific examples with clear structure and strong communication.';
    } else if (starScore >= 75) {
      feedback = 'Great response with excellent detail and specific examples. You demonstrate strong communication skills.';
    } else if (starScore >= 65) {
      feedback = 'Good response with relevant details. With some refinements, this could be outstanding.';
    } else if (starScore >= 50) {
      feedback = 'Decent foundation, but your response needs more depth and specific examples.';
    } else {
      feedback = 'Your response needs significant development. Focus on providing detailed, specific examples.';
    }

    // Limit suggestions to most important ones
    const prioritizedSuggestions = suggestions.slice(0, 3);

    return { starScore, feedback, suggestions: prioritizedSuggestions };
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
    
    try {
      // Check cache first
      const cacheKey = `${interviewStage}:${currentInput}`;
      const cachedResponse = getCachedResponse(cacheKey);
      
      let aiResponse: string;
      if (cachedResponse) {
        aiResponse = cachedResponse;
      } else {
        // Generate new response
        aiResponse = await generateAIResponse(currentInput, interviewStage);
        // Cache the response
        cacheResponse(cacheKey, aiResponse);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setQuestionCount(prev => prev + 1);
      
      // Progress interview stages based on content and question count
      if (interviewStage === 'greeting') {
        setInterviewStage('introduction');
      } else if (interviewStage === 'introduction' && questionCount >= 1) {
        // Move to technical if they mentioned technical terms, otherwise behavioral
        const lowerInput = currentInput.toLowerCase();
        if (lowerInput.includes('project') || lowerInput.includes('code') || lowerInput.includes('develop')) {
          setInterviewStage('technical');
        } else {
          setInterviewStage('behavioral');
        }
      } else if ((interviewStage === 'technical' || interviewStage === 'behavioral') && questionCount >= 3) {
        setInterviewStage('leadership');
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble generating a response right now. Could you please rephrase your answer or try again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                AI Interview Coach
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={resetInterview}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Interview
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Interview Progress */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  interviewStage === 'greeting' ? 'bg-purple-100 dark:bg-purple-900' :
                  interviewStage === 'introduction' ? 'bg-blue-100 dark:bg-blue-900' :
                  interviewStage === 'technical' ? 'bg-green-100 dark:bg-green-900' :
                  interviewStage === 'behavioral' ? 'bg-yellow-100 dark:bg-yellow-900' :
                  'bg-indigo-100 dark:bg-indigo-900'
                }`}>
                  <MessageSquare className={`h-5 w-5 ${
                    interviewStage === 'greeting' ? 'text-purple-600 dark:text-purple-400' :
                    interviewStage === 'introduction' ? 'text-blue-600 dark:text-blue-400' :
                    interviewStage === 'technical' ? 'text-green-600 dark:text-green-400' :
                    interviewStage === 'behavioral' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-indigo-600 dark:text-indigo-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Current Stage
                  </h3>
                  <p className={`text-sm font-semibold ${
                    interviewStage === 'greeting' ? 'text-purple-600 dark:text-purple-400' :
                    interviewStage === 'introduction' ? 'text-blue-600 dark:text-blue-400' :
                    interviewStage === 'technical' ? 'text-green-600 dark:text-green-400' :
                    interviewStage === 'behavioral' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {interviewStage.charAt(0).toUpperCase() + interviewStage.slice(1)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Questions: {questionCount}
                </div>
                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Time: {formatTime(timeSpent)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
          {/* Messages */}
          <div className="h-[calc(100vh-24rem)] overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.analysis && (
                    <div className="mt-3 pt-3 border-t border-purple-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">AI Analysis</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          message.analysis.starScore >= 80 ? 'bg-green-200 text-green-800' :
                          message.analysis.starScore >= 60 ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {message.analysis.starScore}/100
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
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {currentInput.length} characters • {currentInput.trim().split(/\s+/).length} words
                </div>
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
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
