const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { auth, permit } = require('../middleware/auth');

const router = express.Router();

router.post('/:courseId', auth, permit('student'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || course.status !== 'approved') return res.status(404).json({ message: 'Course not available' });

    const existing = await Enrollment.findOne({ student: req.user._id, course: course._id });
    if (existing) return res.status(400).json({ message: 'Already enrolled' });

    const enrollment = new Enrollment({ student: req.user._id, course: course._id });
    await enrollment.save();
    course.studentsEnrolled.push(req.user._id);
    await course.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    if (req.query.teacher === 'true' && req.user.role === 'teacher') {
      const teacherCourses = await Course.find({ teacher: req.user._id }).select('_id');
      const courseIds = teacherCourses.map((course) => course._id);
      const enrollments = await Enrollment.find({ course: { $in: courseIds } })
        .populate('course', 'title description thumbnailUrl')
        .populate('student', 'name email');
      return res.json(enrollments);
    }

    const query = req.user.role === 'student' ? { student: req.user._id } : {};
    const enrollments = await Enrollment.find(query)
      .populate('course', 'title description thumbnailUrl')
      .populate('student', 'name email');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/progress', auth, permit('student'), async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment || !enrollment.student.equals(req.user._id)) return res.status(404).json({ message: 'Enrollment not found' });

    enrollment.progress = Math.min(100, Math.max(0, req.body.progress ?? enrollment.progress));
    enrollment.completed = enrollment.progress === 100;
    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
