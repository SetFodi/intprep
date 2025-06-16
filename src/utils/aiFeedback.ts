import { AIFeedback } from '@/types';
import { ChatCompletionMessageParam } from 'openai';

// Advanced AI feedback patterns and responses
const AI_FEEDBACK_PATTERNS = {
  positive_indicators: [
    'achieved', 'accomplished', 'improved', 'increased', 'successful', 'effective',
    'led', 'managed', 'coordinated', 'implemented', 'delivered', 'exceeded',
    'collaborated', 'mentored', 'optimized', 'streamlined', 'resolved'
  ],

  star_indicators: {
    situation: ['situation', 'context', 'background', 'scenario', 'environment', 'when'],
    task: ['task', 'responsibility', 'goal', 'objective', 'challenge', 'needed to'],
    action: ['action', 'did', 'implemented', 'decided', 'approached', 'strategy', 'steps'],
    result: ['result', 'outcome', 'impact', 'achieved', 'improved', 'increased', 'reduced']
  },

  communication_quality: {
    clarity: ['clear', 'specific', 'detailed', 'explained', 'outlined'],
    confidence: ['confident', 'certain', 'sure', 'believe', 'convinced'],
    professionalism: ['professional', 'appropriate', 'respectful', 'diplomatic']
  }
};

export function generateAIFeedback(response: string, category: string): AIFeedback {
  const wordCount = response.trim().split(/\s+/).length;
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const lowerResponse = response.toLowerCase();

  // Advanced length analysis
  let lengthAnalysis: 'Too Short' | 'Good Length' | 'Too Long';
  if (wordCount < 40) {
    lengthAnalysis = 'Too Short';
  } else if (wordCount > 250) {
    lengthAnalysis = 'Too Long';
  } else {
    lengthAnalysis = 'Good Length';
  }

  // Enhanced STAR method detection
  const starComponents = {
    situation: AI_FEEDBACK_PATTERNS.star_indicators.situation.some(word => lowerResponse.includes(word)),
    task: AI_FEEDBACK_PATTERNS.star_indicators.task.some(word => lowerResponse.includes(word)),
    action: AI_FEEDBACK_PATTERNS.star_indicators.action.some(word => lowerResponse.includes(word)),
    result: AI_FEEDBACK_PATTERNS.star_indicators.result.some(word => lowerResponse.includes(word))
  };

  const starScore = Object.values(starComponents).filter(Boolean).length;
  const starMethodUsed = starScore >= 3;

  // Advanced scoring algorithm
  let score = 60; // Base score

  // Length scoring with nuanced penalties
  if (lengthAnalysis === 'Good Length') score += 15;
  else if (lengthAnalysis === 'Too Short') score -= Math.min(25, (40 - wordCount) * 0.8);
  else score -= Math.min(15, (wordCount - 250) * 0.1);

  // STAR method scoring
  score += starScore * 8; // Up to 32 points for complete STAR

  // Communication quality analysis
  const positiveWords = AI_FEEDBACK_PATTERNS.positive_indicators.filter(word =>
    lowerResponse.includes(word)
  ).length;
  score += Math.min(15, positiveWords * 3);

  // Structure and clarity
  if (sentences.length >= 4) score += 8;
  if (sentences.length >= 6) score += 5;

  // Specificity bonus
  const specificityIndicators = ['specific', 'example', 'instance', 'particular', 'exactly', 'precisely'];
  if (specificityIndicators.some(word => lowerResponse.includes(word))) {
    score += 10;
  }

  // Quantifiable results bonus
  const numberPattern = /\d+/;
  if (numberPattern.test(response)) {
    score += 8;
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Generate detailed feedback
  const analysis = analyzeResponse(response, category, starComponents, wordCount, sentences.length);

  return {
    score,
    strengths: analysis.strengths,
    improvements: analysis.improvements,
    starMethodUsed,
    lengthAnalysis,
    overallFeedback: generateAdvancedFeedback(score, analysis, category),
  };
}

function analyzeResponse(
  response: string,
  category: string,
  starComponents: any,
  wordCount: number,
  sentenceCount: number
) {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const lowerResponse = response.toLowerCase();

  // STAR method analysis with weighted scoring
  const starScores = {
    situation: starComponents.situation ? 25 : 0,
    task: starComponents.task ? 25 : 0,
    action: starComponents.action ? 30 : 0,
    result: starComponents.result ? 20 : 0
  };

  const totalStarScore = Object.values(starScores).reduce((a, b) => a + b, 0);
  
  if (totalStarScore >= 80) {
    strengths.push('Excellent STAR method implementation');
  } else if (totalStarScore >= 60) {
    strengths.push('Good STAR method structure');
  }

  // Detailed STAR feedback
  if (starComponents.situation) {
    strengths.push('Clearly sets the context and situation');
    if (lowerResponse.includes('when') || lowerResponse.includes('where')) {
      strengths.push('Provides specific time and place context');
    }
  } else {
    improvements.push('Start by setting the context or situation');
  }

  if (starComponents.task) {
    strengths.push('Defines responsibilities and objectives well');
    if (lowerResponse.includes('goal') || lowerResponse.includes('objective')) {
      strengths.push('Clearly states goals and objectives');
    }
  } else {
    improvements.push('Clarify your specific role and responsibilities');
  }

  if (starComponents.action) {
    strengths.push('Describes specific actions taken');
    if (lowerResponse.includes('i ') && lowerResponse.split('i ').length > 3) {
      strengths.push('Uses strong first-person action verbs');
    }
  } else {
    improvements.push('Describe the specific actions you took');
  }

  if (starComponents.result) {
    strengths.push('Mentions outcomes and results');
    if (/\d+/.test(response)) {
      strengths.push('Includes quantifiable results and metrics');
    }
  } else {
    improvements.push('Always conclude with the outcome or impact');
  }

  // Enhanced length and structure analysis
  if (wordCount >= 100 && wordCount <= 250) {
    strengths.push('Optimal response length - detailed yet concise');
  } else if (wordCount < 75) {
    improvements.push('Provide more detail and specific examples');
  } else if (wordCount > 300) {
    improvements.push('Consider being more concise while keeping key details');
  }

  // Sentence structure analysis
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((acc, curr) => acc + curr.length, 0) / sentences.length;
  
  if (sentenceCount >= 4 && avgSentenceLength >= 15 && avgSentenceLength <= 25) {
    strengths.push('Well-structured with balanced sentence length');
  } else if (sentenceCount < 3) {
    improvements.push('Expand your response with more supporting details');
  } else if (avgSentenceLength > 30) {
    improvements.push('Consider breaking down longer sentences for clarity');
  }

  // Communication quality metrics
  const actionVerbs = ['implemented', 'developed', 'created', 'led', 'managed', 'improved', 'solved', 'achieved'];
  const usedActionVerbs = actionVerbs.filter(verb => lowerResponse.includes(verb));
  
  if (usedActionVerbs.length >= 3) {
    strengths.push('Uses strong action verbs effectively');
  } else {
    improvements.push('Incorporate more action verbs to demonstrate impact');
  }

  // Quantifiable results analysis
  const numbers = response.match(/\d+/g) || [];
  if (numbers.length >= 2) {
    strengths.push('Includes multiple quantifiable metrics');
  } else if (numbers.length === 1) {
    strengths.push('Includes one quantifiable metric');
  } else {
    improvements.push('Add specific numbers or metrics to strengthen your response');
  }

  // Category-specific analysis with enhanced feedback
  const categoryFeedback = getAdvancedCategoryFeedback(category, lowerResponse);
  strengths.push(...categoryFeedback.strengths);
  improvements.push(...categoryFeedback.improvements);

  // Remove duplicate feedback
  const uniqueStrengths = [...new Set(strengths)];
  const uniqueImprovements = [...new Set(improvements)];

  return { 
    strengths: uniqueStrengths, 
    improvements: uniqueImprovements,
    starScore: totalStarScore
  };
}

function getAdvancedCategoryFeedback(category: string, lowerResponse: string) {
  const strengths: string[] = [];
  const improvements: string[] = [];

  const categoryPatterns = {
    'Leadership': {
      positive: ['led', 'managed', 'guided', 'mentored', 'motivated', 'inspired', 'delegated'],
      suggestions: ['Show how you influenced others', 'Describe your leadership style', 'Mention team outcomes']
    },
    'Teamwork': {
      positive: ['collaborated', 'cooperated', 'supported', 'contributed', 'shared', 'helped'],
      suggestions: ['Highlight collaboration skills', 'Show how you supported teammates', 'Describe team dynamics']
    },
    'Problem Solving': {
      positive: ['analyzed', 'identified', 'solved', 'resolved', 'investigated', 'diagnosed'],
      suggestions: ['Explain your analytical process', 'Show systematic thinking', 'Describe alternative solutions']
    },
    'Communication': {
      positive: ['explained', 'presented', 'communicated', 'clarified', 'discussed', 'negotiated'],
      suggestions: ['Show adaptation to audience', 'Describe communication methods', 'Mention feedback received']
    },
    'technical': {
      positive: ['implemented', 'designed', 'optimized', 'developed', 'architected', 'debugged'],
      suggestions: ['Explain technical decisions', 'Mention technologies used', 'Describe scalability considerations']
    }
  };

  const pattern = categoryPatterns[category as keyof typeof categoryPatterns];
  if (pattern) {
    const foundPositives = pattern.positive.filter(word => lowerResponse.includes(word));
    if (foundPositives.length > 0) {
      strengths.push(`Demonstrates strong ${category.toLowerCase()} skills with action words`);
    } else {
      improvements.push(pattern.suggestions[Math.floor(Math.random() * pattern.suggestions.length)]);
    }
  }

  return { strengths, improvements };
}

function generateAdvancedFeedback(score: number, analysis: any, category: string): string {
  const feedbackTemplates = {
    excellent: [
      "Outstanding response! Your answer demonstrates exceptional interview skills with clear structure, specific examples, and strong communication.",
      "Excellent work! You've crafted a compelling response that showcases your experience effectively and would impress any interviewer.",
      "Superb answer! Your use of specific examples and structured approach makes this a standout response."
    ],
    good: [
      "Strong response with good structure and relevant examples. With minor refinements, this could be an excellent answer.",
      "Good answer that demonstrates your experience well. Consider adding more specific details to make it even stronger.",
      "Solid response that covers the key points. A few enhancements could elevate this to an exceptional answer."
    ],
    developing: [
      "Your response shows promise but needs more development. Focus on providing specific examples and using the STAR method.",
      "Good foundation, but your answer would benefit from more detail and concrete examples to support your points.",
      "You're on the right track. Strengthen your response with more specific situations and measurable outcomes."
    ],
    needs_improvement: [
      "This response needs significant development. Consider using the STAR method and providing specific, detailed examples.",
      "Your answer requires more substance. Focus on concrete examples and clear structure to improve your response.",
      "This response needs more detail and specificity. Use real examples and explain your actions and results clearly."
    ]
  };

  let template: string[];
  if (score >= 85) template = feedbackTemplates.excellent;
  else if (score >= 70) template = feedbackTemplates.good;
  else if (score >= 50) template = feedbackTemplates.developing;
  else template = feedbackTemplates.needs_improvement;

  return template[Math.floor(Math.random() * template.length)];
}

function generateFeedback(transcript: string[]): string {
  // Simple feedback generation
  const wordCount = transcript.join(' ').split(' ').length;
  
  if (wordCount < 50) {
    return "Try to provide more detailed responses. Elaborate on your thoughts and experiences.";
  } else if (wordCount > 500) {
    return "Good detailed response! Try to be more concise while maintaining the key points.";
  }
  
  return "Good response! Continue to elaborate on your experiences and provide specific examples.";
}
