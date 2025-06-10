export interface User {
  _id?: string;
  email: string;
  name: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CodingChallenge {
  _id?: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  timeLimit: number; // in minutes
  createdAt: Date;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface BehavioralQuestion {
  _id?: string;
  question: string;
  category: 'Leadership' | 'Teamwork' | 'Problem Solving' | 'Communication' | 'Conflict Resolution' | 'General';
  tips: string[];
  starMethod: boolean;
  createdAt: Date;
}

export interface UserProgress {
  _id?: string;
  userId: string;
  challengeId?: string;
  questionId?: string;
  type: 'coding' | 'behavioral';
  completed: boolean;
  timeSpent: number; // in seconds
  attempts: number;
  lastAttempt: Date;
  score?: number;
  userCode?: string;
  userResponse?: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  starMethodUsed: boolean;
  lengthAnalysis: 'Too Short' | 'Good Length' | 'Too Long';
  overallFeedback: string;
}

export interface UserStats {
  totalChallengesCompleted: number;
  totalBehavioralCompleted: number;
  averageTimePerChallenge: number;
  averageScore: number;
  streakDays: number;
  lastActivity: Date;
  skillProgress: {
    [category: string]: {
      completed: number;
      total: number;
      averageScore: number;
    };
  };
}
