const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getOverdueTasks,
  getTasksDueThisWeek,
  bulkUpdateStatus,
  bulkDelete
} = require('../controllers/taskController');

const { protect } = require('../middleware/auth');
const {
  validateTask,
  validateTaskId,
  sanitizeInput
} = require('../middleware/validation');

// Apply protection and sanitization to all routes
router.use(protect);
router.use(sanitizeInput);

// Bulk operations (must be before /:id routes)
router.patch('/bulk/status', bulkUpdateStatus);
router.delete('/bulk/delete', bulkDelete);

// Special routes
router.get('/overdue/list', getOverdueTasks);
router.get('/due-week/list', getTasksDueThisWeek);

// CRUD routes
router.route('/')
  .get(getTasks)
  .post(validateTask, createTask);

router.route('/:id')
  .get(validateTaskId, getTask)
  .put(validateTaskId, validateTask, updateTask)
  .delete(validateTaskId, deleteTask);

module.exports = router;
