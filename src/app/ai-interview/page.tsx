'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Brain, Send, Mic, MicOff, RotateCcw, Home, MessageSquare } from 'lucide-react';

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

const AI_RESPONSES = {
  greeting: [
    "Hello! I'm Alex, your AI interviewer. I'm excited to chat with you today. Let's start with something simple - could you tell me a bit about yourself and what brings you here?",
    "Hi there! Welcome to your interview session. I'm here to help you practice and improve. Why don't we begin by having you introduce yourself?",
    "Great to meet you! I'm your AI interviewer for today. Let's dive right in - can you walk me through your background and what you're looking for in your next role?"
  ],
  
  followUps: {
    introduction: [
      "That's interesting! Can you tell me more about what specifically drew you to [field/role]?",
      "I'd love to hear about a project you're particularly proud of. What made it special?",
      "What would you say is your biggest strength, and can you give me an example of how it's helped you?",
      "Tell me about a challenge you've faced recently and how you overcame it."
    ],
    
    technical: [
      "That's a solid approach. How would you handle it if the requirements changed midway through?",
      "Interesting solution. What would you do differently if you had to scale this for millions of users?",
      "Good thinking. Can you walk me through how you would test this?",
      "I like that approach. What alternatives did you consider, and why did you choose this one?"
    ],
    
    behavioral: [
      "That sounds like a challenging situation. How did the other team members react to your approach?",
      "Great example. What did you learn from that experience that you still apply today?",
      "That's impressive. If you faced a similar situation again, would you do anything differently?",
      "Thank you for sharing that. How do you think that experience prepared you for this role?"
    ],
    
    leadership: [
      "That shows great leadership. How do you typically motivate team members who are struggling?",
      "Excellent. Can you tell me about a time when you had to make a difficult decision that affected your team?",
      "That's valuable experience. How do you handle conflicts within your team?",
      "Good insight. What's your approach to giving feedback to team members?"
    ]
  },
  
  deepDive: [
    "Let's dig deeper into that. Can you walk me through your thought process step by step?",
    "That's fascinating. What was the most challenging part of that situation?",
    "I'm curious about the details. How did you measure the success of that initiative?",
    "Can you elaborate on that? What specific actions did you take?"
  ],
  
  closing: [
    "Thank you for those thoughtful responses. Do you have any questions about the role or our company?",
    "This has been a great conversation. Is there anything else you'd like me to know about your experience?",
    "I appreciate your time today. What questions do you have for me about what we've discussed?"
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
    // Start with AI greeting
    const greeting = AI_RESPONSES.greeting[Math.floor(Math.random() * AI_RESPONSES.greeting.length)];
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
    const responses = AI_RESPONSES.followUps[stage as keyof typeof AI_RESPONSES.followUps] || AI_RESPONSES.deepDive;
    
    // Simple keyword-based response selection
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('project') || lowerMessage.includes('built') || lowerMessage.includes('developed')) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (lowerMessage.includes('team') || lowerMessage.includes('collaboration')) {
      setInterviewStage('leadership');
      return AI_RESPONSES.followUps.leadership[Math.floor(Math.random() * AI_RESPONSES.followUps.leadership.length)];
    }
    
    if (lowerMessage.includes('challenge') || lowerMessage.includes('difficult') || lowerMessage.includes('problem')) {
      setInterviewStage('behavioral');
      return AI_RESPONSES.followUps.behavioral[Math.floor(Math.random() * AI_RESPONSES.followUps.behavioral.length)];
    }
    
    if (questionCount >= 4) {
      setInterviewStage('closing');
      return AI_RESPONSES.closing[Math.floor(Math.random() * AI_RESPONSES.closing.length)];
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
    
    // Restart with greeting
    setTimeout(() => {
      const greeting = AI_RESPONSES.greeting[Math.floor(Math.random() * AI_RESPONSES.greeting.length)];
      setMessages([{
        id: '1',
        type: 'ai',
        content: greeting,
        timestamp: new Date()
      }]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Interview Session
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetInterview}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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
        <div className="bg-white rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
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
                <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Type your response here... (Press Enter to send)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
