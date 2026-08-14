const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    grade: { type: Number, min: 0, max: 100 },
    feedback: { type: String, default: '' },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'returned'],
      default: 'submitted',
    },
  },
  { timestamps: true },
);

assignmentSchema.index({ course: 1, student: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
