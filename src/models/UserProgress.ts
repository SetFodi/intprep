import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingChallenge',
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BehavioralQuestion',
  },
  type: {
    type: String,
    enum: ['coding', 'behavioral'],
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  timeSpent: {
    type: Number,
    default: 0, // in seconds
  },
  attempts: {
    type: Number,
    default: 0,
  },
  lastAttempt: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  userCode: {
    type: String,
  },
  userResponse: {
    type: String,
  },
  feedback: {
    type: String,
  },
}, {
  timestamps: true,
});

// Compound index to ensure one progress record per user per challenge/question
UserProgressSchema.index({ userId: 1, challengeId: 1 }, { unique: true, sparse: true });
UserProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true, sparse: true });

export default mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema);
