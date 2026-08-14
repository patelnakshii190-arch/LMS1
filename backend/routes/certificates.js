const express = require('express');
const Certificate = require('../models/Certificate');
const { auth, permit } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, permit('teacher', 'admin'), async (req, res) => {
  try {
    const { student, course, certificateUrl } = req.body;
    if (!student || !course || !certificateUrl) {
      return res.status(400).json({ message: 'Student, course and certificateUrl are required' });
    }

    const existing = await Certificate.findOne({ student, course });
    if (existing) {
      return res.status(409).json({ message: 'Certificate already issued for this student and course' });
    }

    const certificate = await Certificate.create({ student, course, certificateUrl });
    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'student' ? { student: req.user.id } : {};
    const certificates = await Certificate.find(filter)
      .populate('student', 'name email')
      .populate('course', 'title');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
