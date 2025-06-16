import mongoose from 'mongoose';

const UserActivitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['ai_interview', 'coding_challenge', 'practice_session'],
  },
  category: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    index: true,
  },
  details: {
    type: String,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  duration: {
    type: Number, // in minutes
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
UserActivitySchema.index({ userId: 1, createdAt: -1 });
UserActivitySchema.index({ userId: 1, type: 1 });

export const UserActivity = mongoose.models.UserActivity || mongoose.model('UserActivity', UserActivitySchema); 