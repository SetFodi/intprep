import mongoose from 'mongoose';

const BehavioralQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Leadership', 'Teamwork', 'Problem Solving', 'Communication', 'Conflict Resolution', 'General'],
    required: true,
  },
  tips: [{
    type: String,
  }],
  starMethod: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.BehavioralQuestion || mongoose.model('BehavioralQuestion', BehavioralQuestionSchema);
