const express = require('express');
const multer = require('multer');
const path = require('path');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { auth, permit } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads', 'assignments')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post('/:courseId', auth, permit('student'), upload.single('file'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || course.status !== 'approved') return res.status(404).json({ message: 'Course not available' });

    if (!req.file) return res.status(400).json({ message: 'Assignment file is required' });

    const assignment = new Assignment({
      course: course._id,
      student: req.user._id,
      fileUrl: `/uploads/assignments/${req.file.filename}`,
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'student' ? { student: req.user._id } : {};
    const assignments = await Assignment.find(filter)
      .populate('course', 'title')
      .populate('student', 'name email');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/grade', auth, permit('teacher', 'admin'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('course');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (req.user.role === 'teacher' && !assignment.course.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to grade this assignment' });
    }

    assignment.grade = req.body.grade;
    assignment.feedback = req.body.feedback || assignment.feedback;
    assignment.status = 'graded';
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
