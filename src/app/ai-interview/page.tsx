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
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const lowerResponse = response.toLowerCase();
    const suggestions: string[] = [];

    // Start with base score
    let score = 60;

    // Length scoring (more nuanced)
    if (wordCount < 10) {
      score = 25;
      suggestions.push('Your response is too brief. Provide much more detail and specific examples.');
    } else if (wordCount < 25) {
      score = 40;
      suggestions.push('Expand your response with more specific details and examples.');
    } else if (wordCount >= 30 && wordCount <= 120) {
      score += 20; // Good length
    } else if (wordCount > 200) {
      score -= 10;
      suggestions.push('Try to be more concise while maintaining key details.');
    }

    // Context-specific analysis
    if (stage === 'greeting' || stage === 'introduction') {
      // Analyze introduction quality
      if (lowerResponse.includes('self-taught') || lowerResponse.includes('self taught')) {
        score += 15;
      }
      if (lowerResponse.includes('full stack') || lowerResponse.includes('fullstack')) {
        score += 10;
      }

      // Check if they mentioned experience/background
      const hasExperience = lowerResponse.includes('experience') || lowerResponse.includes('background') ||
                           lowerResponse.includes('student') || lowerResponse.includes('university') ||
                           lowerResponse.includes('year') || lowerResponse.includes('major');
      if (hasExperience) {
        score += 10;
      } else {
        suggestions.push('Mention your relevant experience and background');
      }

      // Check for motivation/passion
      const hasMotivation = lowerResponse.includes('passion') || lowerResponse.includes('motivated') ||
                           lowerResponse.includes('love') || lowerResponse.includes('motivates') ||
                           lowerResponse.includes('want') || lowerResponse.includes('enhance') ||
                           lowerResponse.includes('improve') || lowerResponse.includes('girlfriend');
      if (hasMotivation) {
        score += 8;
      } else {
        suggestions.push('Show your passion and motivation for the field');
      }

      // Check for specific technologies or skills
      const techKeywords = ['javascript', 'react', 'node', 'python', 'java', 'sql', 'mongodb', 'aws', 'git',
                           'web developer', 'software engineer', 'computer science', 'technologies'];
      const mentionedTech = techKeywords.filter(tech => lowerResponse.includes(tech));
      if (mentionedTech.length > 0) {
        score += mentionedTech.length * 3;
      } else {
        suggestions.push('Mention specific technologies or skills you have');
      }

      if (wordCount < 20) {
        suggestions.push('Provide more detail about your journey and what drives you');
      }
    }

    if (stage === 'technical' || stage === 'introduction') {
      // Technical response analysis - also applies to introduction if they mention projects
      const hasProjects = lowerResponse.includes('project') || lowerResponse.includes('built') ||
                         lowerResponse.includes('created') || lowerResponse.includes('developed') ||
                         lowerResponse.includes('.com') || lowerResponse.includes('.live') ||
                         lowerResponse.includes('platform') || lowerResponse.includes('website');

      if (hasProjects) {
        score += 20; // Big bonus for mentioning actual projects
      }

      // Check for specific project details
      const projectDetails = ['syncrolly', 'typingy', 'andwatch', 'codeshare', 'typing race',
                             'myanimelist', 'simultaneously', 'real-time', 'collaborative'];
      const detailsMentioned = projectDetails.filter(detail => lowerResponse.includes(detail));
      score += detailsMentioned.length * 5;

      if (lowerResponse.includes('approach') || lowerResponse.includes('solution') || lowerResponse.includes('implement')) {
        score += 15;
      } else if (stage === 'technical') {
        suggestions.push('Describe your approach or solution methodology');
      }

      if (lowerResponse.includes('because') || lowerResponse.includes('reason') || lowerResponse.includes('why')) {
        score += 10;
      } else if (stage === 'technical') {
        suggestions.push('Explain your reasoning behind technical decisions');
      }

      if (lowerResponse.includes('performance') || lowerResponse.includes('optimize') || lowerResponse.includes('scale')) {
        score += 12;
      }

      if (lowerResponse.includes('test') || lowerResponse.includes('debug') || lowerResponse.includes('error')) {
        score += 8;
      }

      const techDepth = ['architecture', 'design pattern', 'algorithm', 'complexity', 'database', 'api',
                        'real-time', 'websocket', 'socket.io', 'collaborative', 'synchronization'];
      const depthMentioned = techDepth.filter(term => lowerResponse.includes(term));
      score += depthMentioned.length * 5;

      // Check for technical challenges mentioned
      const challenges = ['challenging', 'difficult', 'hard', 'obstacle', 'problem', 'issue',
                          'beginning', 'start', 'courses', 'learning', 'managed', 'overcome'];
      const challengesMentioned = challenges.filter(challenge => lowerResponse.includes(challenge));
      if (challengesMentioned.length > 0) {
        score += 10;
      }

      // Bonus for mentioning learning journey and growth
      const learningIndicators = ['courses', 'paid', 'learning', 'taught myself', 'self-taught',
                                 'beginning', 'start', 'journey', 'managed', 'overcome'];
      const learningMentioned = learningIndicators.filter(indicator => lowerResponse.includes(indicator));
      score += learningMentioned.length * 3;
    }

    if (stage === 'behavioral') {
      // STAR method analysis
      const starComponents = {
        situation: ['situation', 'context', 'when', 'where', 'background'].some(word => lowerResponse.includes(word)),
        task: ['task', 'responsibility', 'goal', 'objective', 'needed to'].some(word => lowerResponse.includes(word)),
        action: ['action', 'did', 'implemented', 'decided', 'approached'].some(word => lowerResponse.includes(word)),
        result: ['result', 'outcome', 'achieved', 'improved', 'success'].some(word => lowerResponse.includes(word))
      };

      const starScore = Object.values(starComponents).filter(Boolean).length;
      score += starScore * 8;

      if (!starComponents.situation) suggestions.push('Set the context/situation more clearly');
      if (!starComponents.task) suggestions.push('Explain your specific role and responsibilities');
      if (!starComponents.action) suggestions.push('Describe the specific actions you took');
      if (!starComponents.result) suggestions.push('Always mention the outcome or results');

      if (lowerResponse.includes('learned') || lowerResponse.includes('grew') || lowerResponse.includes('improved')) {
        score += 10;
      } else {
        suggestions.push('Mention what you learned from the experience');
      }
    }

    if (stage === 'leadership') {
      if (lowerResponse.includes('team') || lowerResponse.includes('led') || lowerResponse.includes('managed')) {
        score += 15;
      }
      if (lowerResponse.includes('influence') || lowerResponse.includes('motivate') || lowerResponse.includes('inspire')) {
        score += 12;
      }
      if (lowerResponse.includes('conflict') || lowerResponse.includes('challenge') || lowerResponse.includes('difficult')) {
        score += 10;
      }
    }

    // General quality indicators
    if (sentences.length >= 3) {
      score += 8;
    } else {
      suggestions.push('Structure your response with multiple supporting points');
    }

    // First-person examples
    const firstPersonCount = (lowerResponse.match(/\bi\s/g) || []).length;
    if (firstPersonCount >= 3) {
      score += 8;
    } else if (firstPersonCount === 0) {
      suggestions.push('Use first-person examples ("I did...", "I learned...")');
    }

    // Specific examples and details
    if (lowerResponse.includes('example') || lowerResponse.includes('instance') || lowerResponse.includes('specifically')) {
      score += 10;
    } else {
      suggestions.push('Provide specific examples to illustrate your points');
    }

    // Numbers and metrics
    if (/\d+/.test(response)) {
      score += 8;
    } else {
      suggestions.push('Include quantifiable results when possible');
    }

    // Ensure score is within bounds
    score = Math.max(20, Math.min(100, score));

    // Generate contextual feedback and clean up suggestions
    let feedback = '';
    if (score >= 85) {
      feedback = 'Excellent response! You provided detailed, specific examples with clear structure and strong communication.';
      // Remove basic suggestions for excellent responses
      const excellentSuggestions = suggestions.filter(s =>
        !s.includes('Mention your relevant experience') &&
        !s.includes('Show your passion') &&
        !s.includes('Mention specific technologies') &&
        !s.includes('Structure your response') &&
        !s.includes('Provide specific examples')
      );
      return { score, feedback, suggestions: excellentSuggestions };
    } else if (score >= 70) {
      feedback = 'Good response with relevant details. With some refinements, this could be outstanding.';
    } else if (score >= 55) {
      feedback = 'Decent foundation, but your response needs more depth and specific examples.';
    } else {
      feedback = 'Your response needs significant development. Focus on providing detailed, specific examples.';
    }

    // Limit suggestions to most important ones
    const prioritizedSuggestions = suggestions.slice(0, 3);

    return { score, feedback, suggestions: prioritizedSuggestions };
  };

  const generateAIResponse = (userMessage: string, stage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const wordCount = userMessage.trim().split(/\s+/).length;

    // Check if response is off-topic or too brief
    if (wordCount < 5) {
      return "I appreciate your response, but I'd love to hear more detail. Could you elaborate on that? I'm looking for specific examples and more context to better understand your experience.";
    }

    // Check for completely off-topic responses
    const offTopicIndicators = ['weather', 'sports', 'food', 'movie', 'game', 'music', 'tv show', 'celebrity'];
    const isOffTopic = offTopicIndicators.some(indicator => lowerMessage.includes(indicator));

    if (isOffTopic) {
      return "I appreciate you sharing that, but let's keep our conversation focused on your professional experience and career goals. Could you tell me more about your work background or a specific professional situation you've encountered?";
    }

    // Context-aware responses based on current stage and user input
    if (stage === 'greeting' || stage === 'introduction') {
      // Check if they mentioned specific projects
      if (lowerMessage.includes('syncrolly') || lowerMessage.includes('typingy') || lowerMessage.includes('andwatch') ||
          lowerMessage.includes('project')) {
        return "Wow, those are some impressive projects! Syncrolly sounds like a sophisticated real-time collaboration platform - that must have involved some complex technical challenges around synchronization and concurrent editing. I'm particularly curious about the technical architecture. What technologies did you use for the real-time functionality, and what was the most difficult part of implementing simultaneous code editing? Also, how did you handle conflict resolution when multiple users edit the same code?";
      }

      if (lowerMessage.includes('self-taught') || lowerMessage.includes('self taught')) {
        return "That's impressive - being self-taught shows real dedication and initiative. I'd love to dig deeper into your learning journey. What was the most challenging aspect of teaching yourself development, and how did you overcome those obstacles? Also, can you walk me through a specific project that really solidified your skills?";
      }

      if (lowerMessage.includes('full stack') || lowerMessage.includes('fullstack')) {
        return "Full stack development is quite comprehensive! I'm curious about your technical depth. Which part of the stack do you feel most confident in, and can you describe a complex project where you had to work across the entire technology stack? What specific technologies did you use and what challenges did you face?";
      }

      if (lowerMessage.includes('student') || lowerMessage.includes('university')) {
        return "Balancing university studies with self-taught development shows great time management and passion. How do you balance your formal CS education with your practical development work? Are there gaps between what you're learning academically versus what you need for real-world development?";
      }

      if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
        return "I understand you're looking for opportunities. Let me understand your goals better - what type of role are you targeting, and what specific impact do you want to make? Also, can you tell me about a project or experience that demonstrates you're ready for that next step?";
      }

      if (wordCount < 15) {
        return "I'd love to hear more about your background. Can you walk me through your journey in more detail? What specific experiences have shaped your career path, and what drives your passion for technology?";
      }

      return "That's a great start! Now I want to understand your problem-solving approach. Can you describe a specific technical challenge you've faced recently? Walk me through how you identified the problem, your thought process for solving it, and the outcome.";
    }

    // Technical stage responses
    if (stage === 'technical') {
      if (lowerMessage.includes('react') || lowerMessage.includes('javascript') || lowerMessage.includes('node')) {
        return "I can see you have experience with modern web technologies. Let me challenge you a bit - imagine you're building a feature that suddenly needs to handle 10x more traffic than expected. How would you approach optimizing performance, and what specific strategies would you implement?";
      }

      if (lowerMessage.includes('database') || lowerMessage.includes('sql') || lowerMessage.includes('mongodb')) {
        return "Database experience is crucial. Here's a scenario: you notice your application is running slowly, and you suspect it's database-related. Walk me through your debugging process - what tools would you use, what metrics would you check, and how would you identify the bottleneck?";
      }

      return "That's solid technical thinking. Now let me ask you this - how do you stay current with rapidly evolving technology? Can you give me an example of a new technology you recently learned and how you applied it to solve a real problem?";
    }

    // Behavioral stage responses
    if (stage === 'behavioral') {
      if (lowerMessage.includes('team') || lowerMessage.includes('collaboration')) {
        return "Team dynamics are so important. I want to understand your interpersonal skills better. Tell me about a time when you had to work with someone whose working style was completely different from yours. How did you adapt, and what was the outcome?";
      }

      if (lowerMessage.includes('challenge') || lowerMessage.includes('difficult')) {
        return "I appreciate you sharing that challenge. Now I'm curious about your resilience and learning mindset. Looking back at that situation, what would you do differently today, and how has that experience influenced your approach to similar challenges?";
      }

      return "That shows good self-awareness. Let me explore your growth mindset - can you tell me about a time when you received constructive criticism? How did you handle it, and what specific changes did you make as a result?";
    }

    // Leadership stage responses
    if (stage === 'leadership') {
      return "Leadership skills are valuable at any level. Tell me about a time when you had to influence someone without having direct authority over them. What was the situation, and what strategies did you use to get buy-in?";
    }

    // Default responses based on quality
    if (wordCount > 80) {
      return AI_FARTE_RESPONSES.deepDive[Math.floor(Math.random() * AI_FARTE_RESPONSES.deepDive.length)];
    }

    if (questionCount >= 5) {
      setInterviewStage('closing');
      return AI_FARTE_RESPONSES.closing[Math.floor(Math.random() * AI_FARTE_RESPONSES.closing.length)];
    }

    // Encourage more detail for short responses
    return "I'd like to hear more detail about that. Can you provide a specific example and walk me through your thought process? I'm looking for concrete situations that demonstrate your skills and experience.";
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
