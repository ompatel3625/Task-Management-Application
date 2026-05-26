const { query } = require('../config/database');

class Task {
  // Create new task
  static async create(taskData) {
    const { title, description, priority, status, dueDate, userId } = taskData;
    
    const sql = `
      INSERT INTO tasks (title, description, priority, status, dueDate, userId) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [
      title, 
      description || null, 
      priority || 'medium', 
      status || 'pending', 
      dueDate || null, 
      userId
    ]);
    
    return this.findById(result.insertId);
  }

  // Find task by ID
  static async findById(id) {
    const sql = `
      SELECT t.*, u.name as createdBy, u.email as creatorEmail
      FROM tasks t
      LEFT JOIN users u ON t.userId = u.id
      WHERE t.id = ?
      LIMIT 1
    `;
    const tasks = await query(sql, [id]);
    return tasks[0] || null;
  }

  // Find all tasks for a user with filters
  static async findByUser(userId, filters = {}) {
    let sql = `
      SELECT t.*, u.name as createdBy
      FROM tasks t
      LEFT JOIN users u ON t.userId = u.id
      WHERE t.userId = ?
    `;
    const params = [userId];

    // Apply filters
    if (filters.status) {
      sql += ' AND t.status = ?';
      params.push(filters.status);
    }

    if (filters.priority) {
      sql += ' AND t.priority = ?';
      params.push(filters.priority);
    }

    if (filters.search) {
      sql += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.dueDate) {
      sql += ' AND t.dueDate = ?';
      params.push(filters.dueDate);
    }

    if (filters.overdue === 'true') {
      sql += ' AND t.dueDate < CURDATE() AND t.status != "completed"';
    }

    // Sorting
    const sortBy = filters.sortBy || 'createdAt';
    const order = filters.order === 'asc' ? 'ASC' : 'DESC';
    
    const validSortFields = ['createdAt', 'dueDate', 'priority', 'title', 'status'];
    if (validSortFields.includes(sortBy)) {
      sql += ` ORDER BY t.${sortBy} ${order}`;
    } else {
      sql += ' ORDER BY t.createdAt DESC';
    }

    // Pagination
    if (filters.limit) {
      const limit = parseInt(filters.limit) || 10;
      const offset = (parseInt(filters.page) - 1 || 0) * limit;
      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    return await query(sql, params);
  }

  // Get all tasks (admin)
  static async findAll(filters = {}) {
    let sql = `
      SELECT t.*, u.name as createdBy, u.email as creatorEmail
      FROM tasks t
      LEFT JOIN users u ON t.userId = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      sql += ' AND t.status = ?';
      params.push(filters.status);
    }

    if (filters.priority) {
      sql += ' AND t.priority = ?';
      params.push(filters.priority);
    }

    if (filters.userId) {
      sql += ' AND t.userId = ?';
      params.push(filters.userId);
    }

    sql += ' ORDER BY t.createdAt DESC';

    return await query(sql, params);
  }

  // Update task
  static async update(id, userId, updates) {
    const allowedFields = ['title', 'description', 'priority', 'status', 'dueDate'];
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id, userId);
    const sql = `
      UPDATE tasks 
      SET ${fields.join(', ')} 
      WHERE id = ? AND userId = ?
    `;
    
    const result = await query(sql, values);
    
    if (result.affectedRows === 0) {
      throw new Error('Task not found or unauthorized');
    }

    return this.findById(id);
  }

  // Delete task
  static async delete(id, userId) {
    const sql = 'DELETE FROM tasks WHERE id = ? AND userId = ?';
    const result = await query(sql, [id, userId]);
    
    if (result.affectedRows === 0) {
      throw new Error('Task not found or unauthorized');
    }

    return true;
  }

  // Get task count by status
  static async getCountByStatus(userId) {
    const sql = `
      SELECT 
        status,
        COUNT(*) as count
      FROM tasks
      WHERE userId = ?
      GROUP BY status
    `;
    return await query(sql, [userId]);
  }

  // Get task count by priority
  static async getCountByPriority(userId) {
    const sql = `
      SELECT 
        priority,
        COUNT(*) as count
      FROM tasks
      WHERE userId = ?
      GROUP BY priority
    `;
    return await query(sql, [userId]);
  }

  // Get overdue tasks
  static async getOverdueTasks(userId) {
    const sql = `
      SELECT t.*, u.name as createdBy
      FROM tasks t
      LEFT JOIN users u ON t.userId = u.id
      WHERE t.userId = ? 
      AND t.dueDate < CURDATE() 
      AND t.status != 'completed'
      ORDER BY t.dueDate ASC
    `;
    return await query(sql, [userId]);
  }

  // Get tasks due this week
  static async getTasksDueThisWeek(userId) {
    const sql = `
      SELECT t.*, u.name as createdBy
      FROM tasks t
      LEFT JOIN users u ON t.userId = u.id
      WHERE t.userId = ? 
      AND t.dueDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      AND t.status != 'completed'
      ORDER BY t.dueDate ASC
    `;
    return await query(sql, [userId]);
  }

  // Get weekly task statistics
  static async getWeeklyStats(userId) {
    const sql = `
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count
      FROM tasks
      WHERE userId = ?
      AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `;
    return await query(sql, [userId]);
  }

  // Bulk update tasks
  static async bulkUpdateStatus(taskIds, userId, status) {
    const placeholders = taskIds.map(() => '?').join(',');
    const sql = `
      UPDATE tasks 
      SET status = ? 
      WHERE id IN (${placeholders}) AND userId = ?
    `;
    const params = [status, ...taskIds, userId];
    return await query(sql, params);
  }

  // Bulk delete tasks
  static async bulkDelete(taskIds, userId) {
    const placeholders = taskIds.map(() => '?').join(',');
    const sql = `
      DELETE FROM tasks 
      WHERE id IN (${placeholders}) AND userId = ?
    `;
    const params = [...taskIds, userId];
    return await query(sql, params);
  }
}

module.exports = Task;
