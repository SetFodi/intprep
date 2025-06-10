import mongoose from 'mongoose';

const TestCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const CodingChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  starterCode: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  testCases: [TestCaseSchema],
  timeLimit: {
    type: Number,
    default: 30, // 30 minutes
  },
}, {
  timestamps: true,
});

export default mongoose.models.CodingChallenge || mongoose.model('CodingChallenge', CodingChallengeSchema);
