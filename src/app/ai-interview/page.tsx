'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateAIResponse } from '@/utils/aiResponses';
import { InterviewStage } from '@/types/interview';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInterview() {
  const router = useRouter();
  const [stage, setStage] = useState<InterviewStage>('greeting');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Start with a greeting
    setMessages([
      {
        role: 'assistant',
        content: "Hi! I'm your AI interview coach. I'll be conducting a mock interview today. Let's start with a brief introduction. Could you tell me about yourself and your background in software development?"
      }
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const prompt = `You are an AI interview coach conducting a mock interview. The candidate has responded: "${userMessage}". Please provide a professional and constructive response, including a brief analysis of their answer and a relevant follow-up question.`;
      const response = await generateAIResponse(prompt);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="space-y-4 mb-6">
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
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
