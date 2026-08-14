const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Certificate = require('../models/Certificate');
const { auth, permit } = require('../middleware/auth');

const router = express.Router();

router.get('/users', auth, permit('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/courses', auth, permit('admin'), async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/courses/:id/status', auth, permit('admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.status = req.body.status;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/analytics', auth, permit('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const approvedCourses = await Course.countDocuments({ status: 'approved' });
    res.json({ totalUsers, totalCourses, totalEnrollments, totalAssignments, approvedCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/certificates', auth, permit('admin'), async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('student', 'name email')
      .populate('course', 'title');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;