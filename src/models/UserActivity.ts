import mongoose from 'mongoose';

export interface UserActivityType {
  userId: string;
  type: 'ai_interview' | 'practice_session' | 'coding_challenge';
  category: string;
  score?: number;
  duration?: number;
  details?: string;
  createdAt: Date;
}

const userActivitySchema = new mongoose.Schema<UserActivityType>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['ai_interview', 'practice_session', 'coding_challenge'],
  },
  category: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  duration: {
    type: Number,
    min: 0,
  },
  details: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Create compound index for efficient querying
userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ type: 1, createdAt: -1 });

export const UserActivity = mongoose.models.UserActivity || mongoose.model<UserActivityType>('UserActivity', userActivitySchema); 