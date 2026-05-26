const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getProductivityMetrics,
  getRecentActivity,
  getUpcomingDeadlines
} = require('../controllers/dashboardController');

const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/productivity', getProductivityMetrics);
router.get('/activity', getRecentActivity);
router.get('/deadlines', getUpcomingDeadlines);

module.exports = router;
