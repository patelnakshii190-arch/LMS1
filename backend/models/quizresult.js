const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    score: {
      type: Number,
      required: true
    },

    totalQuestions: {
      type: Number,
      required: true
    },

    passed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("QuizResult", quizResultSchema);