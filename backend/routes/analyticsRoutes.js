const express = require("express");
const router = express.Router();

const {
  getAnalytics,
  createAnalytics,
} = require("../controllers/analyticsController");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Analytics API is working!"
  });
});

// GET analytics
router.get("/", getAnalytics);

// POST analytics
router.post("/", createAnalytics);

module.exports = router;