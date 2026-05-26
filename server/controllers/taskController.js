const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      search: req.query.search,
      dueDate: req.query.dueDate,
      overdue: req.query.overdue,
      sortBy: req.query.sortBy,
      order: req.query.order,
      limit: req.query.limit,
      page: req.query.page
    };

    const tasks = await Task.findByUser(req.user.id, filters);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user owns the task
    if (task.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const taskData = {
      title,
      description,
      priority: priority || 'medium',
      status: status || 'pending',
      dueDate,
      userId: req.user.id
    };

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate;

    const task = await Task.update(req.params.id, req.user.id, updates);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });

  } catch (error) {
    console.error('Update task error:', error);
    
    if (error.message === 'Task not found or unauthorized') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    await Task.delete(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    
    if (error.message === 'Task not found or unauthorized') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

// @desc    Get overdue tasks
// @route   GET /api/tasks/overdue/list
// @access  Private
exports.getOverdueTasks = async (req, res) => {
  try {
    const tasks = await Task.getOverdueTasks(req.user.id);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    console.error('Get overdue tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue tasks',
      error: error.message
    });
  }
};

// @desc    Get tasks due this week
// @route   GET /api/tasks/due-week/list
// @access  Private
exports.getTasksDueThisWeek = async (req, res) => {
  try {
    const tasks = await Task.getTasksDueThisWeek(req.user.id);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    console.error('Get tasks due this week error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks due this week',
      error: error.message
    });
  }
};

// @desc    Bulk update task status
// @route   PATCH /api/tasks/bulk/status
// @access  Private
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { taskIds, status } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task IDs array is required'
      });
    }

    if (!status || !['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }

    await Task.bulkUpdateStatus(taskIds, req.user.id, status);

    res.status(200).json({
      success: true,
      message: 'Tasks updated successfully'
    });

  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tasks',
      error: error.message
    });
  }
};

// @desc    Bulk delete tasks
// @route   DELETE /api/tasks/bulk/delete
// @access  Private
exports.bulkDelete = async (req, res) => {
  try {
    const { taskIds } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task IDs array is required'
      });
    }

    await Task.bulkDelete(taskIds, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Tasks deleted successfully'
    });

  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tasks',
      error: error.message
    });
  }
};
