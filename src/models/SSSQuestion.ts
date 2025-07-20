 import mongoose from 'mongoose';

const SSSQuestionSchema = new mongoose.Schema({
  q: {
    type: String,
    required: true,
    trim: true
  },
  a: {
    type: String,
    required: true
  },
  addedBy: {
    type: String,
    required: true,
    default: 'System'
  },
  role: {
    type: String,
    required: true,
    default: 'system'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // createdAt, updatedAt otomatik eklenir
});

// Index'ler
SSSQuestionSchema.index({ q: 'text', a: 'text' }); // Arama için
SSSQuestionSchema.index({ isActive: 1 });
SSSQuestionSchema.index({ createdAt: -1 });

const SSSQuestion = mongoose.models.SSSQuestion || mongoose.model('SSSQuestion', SSSQuestionSchema);

export default SSSQuestion;
