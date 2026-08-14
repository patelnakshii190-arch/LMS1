require("dotenv").config();

const connectDB = require("./config/db");
const Analytics = require("./models/Analytics");

const analyticsData = [
  {
    studentName: "Rahul",
    courseName: "React JS",
    score: 92,
    progress: 95,
    completedLessons: 19,
    totalLessons: 20,
  },

  {
    studentName: "Priya",
    courseName: "Node JS",
    score: 85,
    progress: 80,
    completedLessons: 16,
    totalLessons: 20,
  },

  {
    studentName: "Aisha",
    courseName: "MongoDB",
    score: 78,
    progress: 72,
    completedLessons: 14,
    totalLessons: 20,
  },

  {
    studentName: "Rohan",
    courseName: "Python",
    score: 88,
    progress: 90,
    completedLessons: 18,
    totalLessons: 20,
  },

  {
    studentName: "Neha",
    courseName: "Java",
    score: 81,
    progress: 84,
    completedLessons: 17,
    totalLessons: 20,
  },

  {
    studentName: "Arjun",
    courseName: "HTML & CSS",
    score: 94,
    progress: 98,
    completedLessons: 20,
    totalLessons: 20,
  },

  {
    studentName: "Kavya",
    courseName: "JavaScript",
    score: 89,
    progress: 91,
    completedLessons: 18,
    totalLessons: 20,
  },

  {
    studentName: "Mehul",
    courseName: "Express JS",
    score: 76,
    progress: 70,
    completedLessons: 14,
    totalLessons: 20,
  },

  {
    studentName: "Diya",
    courseName: "React JS",
    score: 91,
    progress: 93,
    completedLessons: 19,
    totalLessons: 20,
  },

  {
    studentName: "Yash",
    courseName: "Node JS",
    score: 83,
    progress: 79,
    completedLessons: 16,
    totalLessons: 20,
  },

  {
    studentName: "Ishita",
    courseName: "MongoDB",
    score: 87,
    progress: 86,
    completedLessons: 17,
    totalLessons: 20,
  },

  {
    studentName: "Karan",
    courseName: "Python",
    score: 72,
    progress: 68,
    completedLessons: 14,
    totalLessons: 20,
  },

  {
    studentName: "Pooja",
    courseName: "Java",
    score: 95,
    progress: 96,
    completedLessons: 19,
    totalLessons: 20,
  },

  {
    studentName: "Dev",
    courseName: "HTML & CSS",
    score: 80,
    progress: 82,
    completedLessons: 16,
    totalLessons: 20,
  },

  {
    studentName: "Anaya",
    courseName: "JavaScript",
    score: 90,
    progress: 88,
    completedLessons: 18,
    totalLessons: 20,
  },

  {
    studentName: "Vivek",
    courseName: "Express JS",
    score: 74,
    progress: 75,
    completedLessons: 15,
    totalLessons: 20,
  },

  {
    studentName: "Simran",
    courseName: "React JS",
    score: 86,
    progress: 89,
    completedLessons: 18,
    totalLessons: 20,
  },

  {
    studentName: "Aman",
    courseName: "Node JS",
    score: 79,
    progress: 77,
    completedLessons: 15,
    totalLessons: 20,
  },

  {
    studentName: "Nisha",
    courseName: "MongoDB",
    score: 93,
    progress: 94,
    completedLessons: 19,
    totalLessons: 20,
  },

  {
    studentName: "Harsh",
    courseName: "Python",
    score: 84,
    progress: 81,
    completedLessons: 16,
    totalLessons: 20,
  },

  {
    studentName: "Mansi",
    courseName: "Java",
    score: 77,
    progress: 73,
    completedLessons: 15,
    totalLessons: 20,
  },

  {
    studentName: "Dhruv",
    courseName: "HTML & CSS",
    score: 96,
    progress: 97,
    completedLessons: 20,
    totalLessons: 20,
  },

  {
    studentName: "Jiya",
    courseName: "JavaScript",
    score: 82,
    progress: 85,
    completedLessons: 17,
    totalLessons: 20,
  },

  {
    studentName: "Aditya",
    courseName: "Express JS",
    score: 88,
    progress: 90,
    completedLessons: 18,
    totalLessons: 20,
  },

  {
    studentName: "Sneha",
    courseName: "React JS",
    score: 90,
    progress: 92,
    completedLessons: 18,
    totalLessons: 20,
  },
];


const seedAnalytics = async () => {
  try {
    await connectDB();

    await Analytics.deleteMany({});

    await Analytics.insertMany(analyticsData);

    console.log(
      `✅ ${analyticsData.length} analytics records inserted`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Analytics seed error:",
      error
    );

    process.exit(1);
  }
};

seedAnalytics();