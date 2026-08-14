const express = require('express');
const multer = require('multer');
const path = require('path');
const AssignmentTask = require('../models/AssignmentTask');
const Course = require('../models/Course');
const { auth, permit } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads', 'assignments')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post('/:courseId', auth, permit('teacher', 'admin'), upload.single('attachment'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || course.status !== 'approved') {
      return res.status(404).json({ message: 'Course not available' });
    }

    const task = new AssignmentTask({
      course: course._id,
      teacher: req.user._id,
      title: req.body.title,
      description: req.body.description || '',
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
      attachmentUrl: req.file ? `/uploads/assignments/${req.file.filename}` : undefined,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'teacher') {
      filter.teacher = req.user._id;
    } else if (req.user.role === 'student') {
      const enrollments = await require('../models/Enrollment').find({ student: req.user._id }).select('course');
      const courseIds = enrollments.map((item) => item.course);
      filter.course = { $in: courseIds };
    }

    const tasks = await AssignmentTask.find(filter)
      .populate('course', 'title')
      .populate('teacher', 'name email');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
