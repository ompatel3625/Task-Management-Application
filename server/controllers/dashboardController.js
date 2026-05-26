const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user statistics
    const stats = await User.getStats(userId);

    // Get task count by status
    const statusCounts = await Task.getCountByStatus(userId);
    
    // Get task count by priority
    const priorityCounts = await Task.getCountByPriority(userId);

    // Get weekly stats
    const weeklyStats = await Task.getWeeklyStats(userId);

    // Format status counts
    const formattedStatus = {
      pending: 0,
      in_progress: 0,
      completed: 0
    };

    statusCounts.forEach(item => {
      formattedStatus[item.status] = parseInt(item.count);
    });

    // Format priority counts
    const formattedPriority = {
      low: 0,
      medium: 0,
      high: 0
    };

    priorityCounts.forEach(item => {
      formattedPriority[item.priority] = parseInt(item.count);
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalTasks: parseInt(stats.totalTasks) || 0,
          completedTasks: parseInt(stats.completedTasks) || 0,
          pendingTasks: parseInt(stats.pendingTasks) || 0,
          inProgressTasks: parseInt(stats.inProgressTasks) || 0,
          overdueTasks: parseInt(stats.overdueTasks) || 0
        },
        statusBreakdown: formattedStatus,
        priorityBreakdown: formattedPriority,
        weeklyActivity: weeklyStats
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get productivity metrics
// @route   GET /api/dashboard/productivity
// @access  Private
exports.getProductivityMetrics = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await User.getStats(userId);
    
    // Calculate completion rate
    const totalTasks = parseInt(stats.totalTasks) || 0;
    const completedTasks = parseInt(stats.completedTasks) || 0;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    // Calculate on-time completion (tasks completed before due date)
    // This would require additional query - simplified version here
    const onTimeRate = 85; // Placeholder

    res.status(200).json({
      success: true,
      data: {
        completionRate: parseFloat(completionRate),
        onTimeRate: onTimeRate,
        totalCompleted: completedTasks,
        averageCompletionTime: 3.5, // Placeholder - would calculate from actual data
        streak: 7 // Placeholder - consecutive days with completed tasks
      }
    });

  } catch (error) {
    console.error('Get productivity metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching productivity metrics',
      error: error.message
    });
  }
};

// @desc    Get recent activity
// @route   GET /api/dashboard/activity
// @access  Private
exports.getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    // Get recent tasks (last updated)
    const recentTasks = await Task.findByUser(userId, {
      sortBy: 'updatedAt',
      order: 'desc',
      limit: limit
    });

    res.status(200).json({
      success: true,
      count: recentTasks.length,
      data: recentTasks
    });

  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      error: error.message
    });
  }
};

// @desc    Get upcoming deadlines
// @route   GET /api/dashboard/deadlines
// @access  Private
exports.getUpcomingDeadlines = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get tasks due this week
    const upcomingTasks = await Task.getTasksDueThisWeek(userId);

    res.status(200).json({
      success: true,
      count: upcomingTasks.length,
      data: upcomingTasks
    });

  } catch (error) {
    console.error('Get upcoming deadlines error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming deadlines',
      error: error.message
    });
  }
};
