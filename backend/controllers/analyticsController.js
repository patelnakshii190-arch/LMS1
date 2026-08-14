const Analytics = require("../models/Analytics");

exports.getAnalytics = async (req, res) => {
  try {
    console.log("📊 GET /api/analytics called");

    const records = await Analytics.find()
      .sort({ score: -1 })
      .lean();

    console.log("📊 Analytics records:", records.length);

    const totalStudents = new Set(
      records.map((item) => item.studentName)
    ).size;

    const totalCourses = new Set(
      records.map((item) => item.courseName)
    ).size;

    const averageScore =
      records.length > 0
        ? records.reduce((sum, item) => sum + item.score, 0) /
          records.length
        : 0;

    const averageProgress =
      records.length > 0
        ? records.reduce((sum, item) => sum + item.progress, 0) /
          records.length
        : 0;

    const highestScore =
      records.length > 0
        ? Math.max(...records.map((item) => item.score))
        : 0;

    const studentPerformance = records.map((item) => ({
      name: item.studentName,
      score: item.score,
      progress: item.progress,
      course: item.courseName,
    }));

    const courseProgress = records.map((item) => ({
      course: item.courseName,
      score: item.score,
      progress: item.progress,
    }));

    const topStudents = [...records]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => ({
        name: item.studentName,
        course: item.courseName,
        score: item.score,
        progress: item.progress,
      }));

    const studentsNeedImprovement = records
      .filter((item) => item.score < 75)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
      .map((item) => ({
        name: item.studentName,
        course: item.courseName,
        score: item.score,
        progress: item.progress,
      }));

    const scoreDistribution = [
      {
        range: "90-100",
        count: records.filter((item) => item.score >= 90).length,
      },
      {
        range: "80-89",
        count: records.filter(
          (item) => item.score >= 80 && item.score < 90
        ).length,
      },
      {
        range: "70-79",
        count: records.filter(
          (item) => item.score >= 70 && item.score < 80
        ).length,
      },
      {
        range: "Below 70",
        count: records.filter((item) => item.score < 70).length,
      },
    ];

    res.status(200).json({
      success: true,

      summary: {
        totalStudents,
        totalCourses,
        averageScore: Number(averageScore.toFixed(1)),
        averageProgress: Number(averageProgress.toFixed(1)),
        highestScore,
      },

      records,
      studentPerformance,
      courseProgress,
      topStudents,
      studentsNeedImprovement,
      scoreDistribution,
    });
  } catch (error) {
    console.error("❌ Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load analytics",
      error: error.message,
    });
  }
};