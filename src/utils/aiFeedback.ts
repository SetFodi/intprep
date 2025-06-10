import { AIFeedback } from '@/types';

export function generateAIFeedback(response: string, category: string): AIFeedback {
  const wordCount = response.trim().split(/\s+/).length;
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Analyze length
  let lengthAnalysis: 'Too Short' | 'Good Length' | 'Too Long';
  if (wordCount < 50) {
    lengthAnalysis = 'Too Short';
  } else if (wordCount > 300) {
    lengthAnalysis = 'Too Long';
  } else {
    lengthAnalysis = 'Good Length';
  }

  // Check for STAR method indicators
  const starKeywords = [
    'situation', 'task', 'action', 'result', 'outcome', 'challenge', 'problem',
    'responsibility', 'implemented', 'achieved', 'accomplished', 'led', 'managed'
  ];
  const starMethodUsed = starKeywords.some(keyword => 
    response.toLowerCase().includes(keyword)
  );

  // Generate score based on various factors
  let score = 50; // Base score

  // Length scoring
  if (lengthAnalysis === 'Good Length') score += 20;
  else if (lengthAnalysis === 'Too Short') score -= 15;
  else score -= 10;

  // STAR method bonus
  if (starMethodUsed) score += 15;

  // Structure bonus (multiple sentences)
  if (sentences.length >= 3) score += 10;

  // Specific examples bonus
  const specificWords = ['specific', 'example', 'instance', 'time', 'project', 'team'];
  if (specificWords.some(word => response.toLowerCase().includes(word))) {
    score += 10;
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Generate strengths and improvements based on analysis
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (lengthAnalysis === 'Good Length') {
    strengths.push('Good response length - detailed but concise');
  }
  if (starMethodUsed) {
    strengths.push('Uses structured approach with clear situation and actions');
  }
  if (sentences.length >= 3) {
    strengths.push('Well-structured response with multiple points');
  }

  if (lengthAnalysis === 'Too Short') {
    improvements.push('Provide more specific details and examples');
  }
  if (lengthAnalysis === 'Too Long') {
    improvements.push('Try to be more concise while maintaining key details');
  }
  if (!starMethodUsed) {
    improvements.push('Consider using the STAR method (Situation, Task, Action, Result)');
  }

  // Category-specific feedback
  const categoryFeedback = getCategorySpecificFeedback(category, response);
  strengths.push(...categoryFeedback.strengths);
  improvements.push(...categoryFeedback.improvements);

  const overallFeedback = generateOverallFeedback(score, lengthAnalysis, starMethodUsed);

  return {
    score,
    strengths,
    improvements,
    starMethodUsed,
    lengthAnalysis,
    overallFeedback,
  };
}

function getCategorySpecificFeedback(category: string, response: string) {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const lowerResponse = response.toLowerCase();

  switch (category) {
    case 'Leadership':
      if (lowerResponse.includes('team') || lowerResponse.includes('led')) {
        strengths.push('Demonstrates leadership experience with teams');
      } else {
        improvements.push('Include specific examples of leading or influencing others');
      }
      break;

    case 'Teamwork':
      if (lowerResponse.includes('collaborate') || lowerResponse.includes('team')) {
        strengths.push('Shows collaborative mindset');
      } else {
        improvements.push('Highlight how you worked with others to achieve goals');
      }
      break;

    case 'Problem Solving':
      if (lowerResponse.includes('solution') || lowerResponse.includes('solve')) {
        strengths.push('Clearly identifies problem-solving approach');
      } else {
        improvements.push('Describe your analytical process and solution methodology');
      }
      break;

    case 'Communication':
      if (lowerResponse.includes('explain') || lowerResponse.includes('communicate')) {
        strengths.push('Demonstrates communication awareness');
      } else {
        improvements.push('Include examples of how you communicated complex ideas');
      }
      break;

    case 'Conflict Resolution':
      if (lowerResponse.includes('conflict') || lowerResponse.includes('disagree')) {
        strengths.push('Addresses conflict directly');
      } else {
        improvements.push('Be more specific about the conflict and resolution steps');
      }
      break;
  }

  return { strengths, improvements };
}

function generateOverallFeedback(score: number, lengthAnalysis: string, starMethodUsed: boolean): string {
  if (score >= 80) {
    return "Excellent response! You've provided a well-structured answer with good detail and clear examples. This demonstrates strong interview skills.";
  } else if (score >= 60) {
    return "Good response with room for improvement. You're on the right track but could enhance your answer with more specific details or better structure.";
  } else if (score >= 40) {
    return "Your response shows potential but needs development. Focus on providing more concrete examples and using a structured approach like the STAR method.";
  } else {
    return "This response needs significant improvement. Consider providing more detail, specific examples, and using the STAR method to structure your answer.";
  }
}
