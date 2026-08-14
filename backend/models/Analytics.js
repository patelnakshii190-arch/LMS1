const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    completedLessons: {
      type: Number,
      required: true,
      min: 0,
    },

    totalLessons: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analytics", analyticsSchema);