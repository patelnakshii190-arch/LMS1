const express = require('express');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { auth, permit } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, permit('teacher', 'admin'), async (req, res) => {
  try {
    const course = new Course({ ...req.body, teacher: req.user._id });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { mine, videos } = req.query;

    if (videos === 'true') {
      let courseQuery = {};
      if (req.user.role === 'teacher') {
        courseQuery = { teacher: req.user._id };
      } else if (req.user.role === 'student') {
        const enrollments = await Enrollment.find({ student: req.user._id }).select('course');
        const courseIds = enrollments.map((item) => item.course);
        courseQuery = { _id: { $in: courseIds }, status: 'approved' };
      } else {
        courseQuery = { status: 'approved' };
      }

      const courses = await Course.find(courseQuery).select('title lessons');
      const videosList = courses.flatMap((course) =>
        course.lessons.map((lesson) => ({
          courseId: course._id,
          courseTitle: course.title,
          lessonTitle: lesson.title,
          videoUrl: lesson.videoUrl,
          description: lesson.description
        }))
      );

      return res.json(videosList);
    }

    if (mine === 'true') {
      if (req.user.role === 'teacher') {
        const courses = await Course.find({ teacher: req.user._id }).populate('teacher', 'name email');
        return res.json(courses);
      }

      if (req.user.role === 'student') {
        const enrollments = await Enrollment.find({ student: req.user._id }).populate('course', 'title description thumbnailUrl status');
        const courseIds = enrollments.map((item) => item.course._id);
        const courses = await Course.find({ _id: { $in: courseIds }, status: 'approved' }).populate('teacher', 'name email');
        return res.json(courses);
      }
    }

    const filters = { status: 'approved' };
    if (req.user.role === 'teacher') {
      filters.$or = [{ status: 'approved' }, { teacher: req.user._id }];
    }
    const courses = await Course.find(filters).populate('teacher', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.status !== 'approved' && req.user.role === 'student') {
      return res.status(403).json({ message: 'Course not available' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, permit('teacher', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (req.user.role === 'teacher' && !course.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only course owner can update' });
    }
    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, permit('teacher', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (req.user.role === 'teacher' && !course.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only course owner can delete' });
    }
    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
