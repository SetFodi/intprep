'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateAIResponse } from '@/utils/aiResponses';
import { InterviewStage } from '@/types/interview';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInterview() {
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<InterviewStage>('introduction');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Start with AI's introduction
    setMessages([{
      role: 'assistant',
      content: "Hi there! I'm AI Farte, your AI interview specialist. I combine natural language processing with real-world hiring insights to give you the most realistic practice possible. Let's start with the classic opener - but I want you to think strategically about how you position yourself. What's your elevator pitch?"
    }]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage = input.trim();
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setInput('');

      // Get AI response
      const response = await generateAIResponse(userMessage, stage);
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      
      // Update stage if needed
      if (stage === 'introduction') {
        setStage('technical');
      }
    } catch (err) {
      console.error('Error in AI interview:', err);
      setError('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
              <h1 className="text-2xl font-bold text-white">AI Interview Practice</h1>
              <p className="text-purple-100 mt-2">Practice with our AI interviewer to improve your skills</p>
            </div>

            {/* Messages */}
            <div className="h-[calc(100vh-16rem)] overflow-y-auto p-6 space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 form-input"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium
                           hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors duration-200"
                >
                  Send
                </button>
              </div>
              {error && (
                <p className="mt-2 text-red-500 text-sm">{error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
