const express = require("express");

const router = express.Router();

const Analytics = require("../models/Analytics");

// ======================================================
// GET ANALYTICS
// ======================================================

router.get("/", async (req, res) => {
  try {
    const records = await Analytics.find().sort({
      createdAt: -1,
    });

    // ------------------------------------------
    // SUMMARY
    // ------------------------------------------

    const totalStudents = records.length;

    const totalCourses = new Set(
      records.map((record) => record.courseName)
    ).size;

    const averageScore =
      totalStudents > 0
        ? records.reduce(
            (total, record) =>
              total + Number(record.score || 0),
            0
          ) / totalStudents
        : 0;

    const averageProgress =
      totalStudents > 0
        ? records.reduce(
            (total, record) =>
              total + Number(record.progress || 0),
            0
          ) / totalStudents
        : 0;

    const highestScore =
      records.length > 0
        ? Math.max(
            ...records.map((record) =>
              Number(record.score || 0)
            )
          )
        : 0;

    // ------------------------------------------
    // TOP STUDENTS
    // ------------------------------------------

    const topStudents = [...records]
      .sort(
        (a, b) =>
          Number(b.score || 0) -
          Number(a.score || 0)
      )
      .slice(0, 5)
      .map((student) => ({
        name: student.studentName,
        course: student.courseName,
        score: Number(student.score || 0),
        progress: Number(student.progress || 0),
      }));

    // ------------------------------------------
    // STUDENTS NEEDING IMPROVEMENT
    // ------------------------------------------

    const studentsNeedImprovement = records
      .filter(
        (student) =>
          Number(student.score || 0) < 75
      )
      .sort(
        (a, b) =>
          Number(a.score || 0) -
          Number(b.score || 0)
      )
      .map((student) => ({
        name: student.studentName,
        course: student.courseName,
        score: Number(student.score || 0),
        progress: Number(student.progress || 0),
      }));

    // ------------------------------------------
    // COURSE PROGRESS
    // ------------------------------------------

    const courseMap = {};

    records.forEach((student) => {
      const course = student.courseName;

      if (!courseMap[course]) {
        courseMap[course] = {
          scoreTotal: 0,
          progressTotal: 0,
          count: 0,
        };
      }

      courseMap[course].scoreTotal += Number(
        student.score || 0
      );

      courseMap[course].progressTotal += Number(
        student.progress || 0
      );

      courseMap[course].count += 1;
    });

    const courseProgress = Object.entries(
      courseMap
    ).map(([course, value]) => ({
      course,

      score:
        value.count > 0
          ? Math.round(
              value.scoreTotal / value.count
            )
          : 0,

      progress:
        value.count > 0
          ? Math.round(
              value.progressTotal /
                value.count
            )
          : 0,
    }));

    // ------------------------------------------
    // SCORE DISTRIBUTION
    // ------------------------------------------

    const scoreDistribution = [
      {
        range: "90-100",
        count: records.filter(
          (student) =>
            Number(student.score || 0) >= 90
        ).length,
      },

      {
        range: "75-89",
        count: records.filter(
          (student) => {
            const score = Number(
              student.score || 0
            );

            return score >= 75 && score < 90;
          }
        ).length,
      },

      {
        range: "60-74",
        count: records.filter(
          (student) => {
            const score = Number(
              student.score || 0
            );

            return score >= 60 && score < 75;
          }
        ).length,
      },

      {
        range: "Below 60",
        count: records.filter(
          (student) =>
            Number(student.score || 0) < 60
        ).length,
      },
    ];

    // ------------------------------------------
    // STUDENT PERFORMANCE
    // ------------------------------------------

    const studentPerformance = records.map(
      (student) => ({
        name: student.studentName,
        score: Number(student.score || 0),
        progress: Number(
          student.progress || 0
        ),
        course: student.courseName,
      })
    );

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    res.status(200).json({
      success: true,

      summary: {
        totalStudents,
        totalCourses,
        averageScore: Number(
          averageScore.toFixed(1)
        ),
        averageProgress: Number(
          averageProgress.toFixed(1)
        ),
        highestScore,
      },

      records,

      topStudents,

      studentsNeedImprovement,

      courseProgress,

      scoreDistribution,

      studentPerformance,
    });
  } catch (error) {
    console.error(
      "GET Analytics Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get analytics",
      error: error.message,
    });
  }
});

// ======================================================
// POST ANALYTICS
// ======================================================

router.post("/", async (req, res) => {
  try {
    console.log(
      "Analytics data received:",
      req.body
    );

    const {
      studentName,
      courseName,
      score,
      progress,
      completedLessons,
      totalLessons,
    } = req.body;

    if (
      !studentName ||
      !courseName ||
      score === undefined ||
      progress === undefined ||
      completedLessons === undefined ||
      totalLessons === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All analytics fields are required",
      });
    }

    const newAnalytics = new Analytics({
      studentName,
      courseName,
      score,
      progress,
      completedLessons,
      totalLessons,
    });

    const savedAnalytics =
      await newAnalytics.save();

    res.status(201).json({
      success: true,
      message:
        "Analytics data added successfully",
      data: savedAnalytics,
    });
  } catch (error) {
    console.error(
      "POST Analytics Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add analytics",
      error: error.message,
    });
  }
});

module.exports = router;