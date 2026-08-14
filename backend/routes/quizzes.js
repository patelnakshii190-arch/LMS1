const express = require('express');
const Quiz = require('../models/quiz');
const Enrollment = require('../models/Enrollment');
const { auth, permit } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, permit('teacher', 'admin'), async (req, res) => {
  try {
    const { course, title, questions = [], passingScore = 60 } = req.body;
    if (!course || !title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Course, title and questions are required' });
    }

    const quiz = await Quiz.create({
      course,
      teacher: req.user.id,
      title,
      questions,
      passingScore
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'teacher') {
      query.teacher = req.user.id;
    } else if (req.user.role === 'student') {
      const enrollments = await Enrollment.find({ student: req.user.id }).select('course');
      const courseIds = enrollments.map((item) => item.course);
      query.course = { $in: courseIds };
    }

    const quizzes = await Quiz.find(query).populate('course', 'title').populate('teacher', 'name email');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'title').populate('teacher', 'name email');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({ student: req.user.id, course: quiz.course._id });
      if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
