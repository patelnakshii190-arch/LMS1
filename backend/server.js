const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courses");
const assignmentRoutes = require("./routes/assignments");
const assignmentTaskRoutes = require("./routes/assignmentTasks");
const enrollmentRoutes = require("./routes/enrollments");
const quizRoutes = require("./routes/quizzes");
const certificateRoutes = require("./routes/certificates");
const adminRoutes = require("./routes/admin");
const analyticsRoutes = require("./routes/analytics");

const { auth } = require("./middleware/auth");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));


// ==========================================
// BASIC TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  console.log("ROOT ROUTE HIT");

  res.status(200).json({
    success: true,
    message: "LMS Backend is working",
  });
});


// ==========================================
// ANALYTICS TEST ROUTE
// ==========================================

app.get("/api/analytics/test", (req, res) => {
  console.log("ANALYTICS TEST ROUTE HIT");

  res.status(200).json({
    success: true,
    message: "Analytics API is working",
  });
});


// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/assignments", assignmentRoutes);

app.use("/api/assignment-tasks", assignmentTaskRoutes);

app.use("/api/enrollments", enrollmentRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/certificates", certificateRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/analytics", analyticsRoutes);


// ==========================================
// DASHBOARD
// ==========================================

app.get("/api/dashboard", auth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});


// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Backend: http://localhost:${PORT}`);
      console.log(
        `Analytics test: http://localhost:${PORT}/api/analytics/test`
      );
    });

  } catch (error) {
    console.error("Failed to start server:");
    console.error(error);
    process.exit(1);
  }
};

startServer();