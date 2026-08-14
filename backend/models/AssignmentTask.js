const mongoose = require('mongoose');

const assignmentTaskSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date },
    attachmentUrl: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('AssignmentTask', assignmentTaskSchema);
