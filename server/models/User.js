const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    try {
      const { name, email, password, role = 'user' } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const sql = `
        INSERT INTO users (name, email, password, role) 
        VALUES (?, ?, ?, ?)
      `;
      
      const result = await query(sql, [name, email, hashedPassword, role]);
      return result.insertId;
    } catch (error) {
      console.error('User create error:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const users = await query(sql, [email]);
    return users[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const sql = 'SELECT id, name, email, role, avatar, isActive, createdAt, updatedAt FROM users WHERE id = ? LIMIT 1';
    const users = await query(sql, [id]);
    return users[0] || null;
  }

  // Update user
  static async update(id, updates) {
    const allowedFields = ['name', 'email', 'avatar', 'isActive'];
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

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    await query(sql, values);
    return this.findById(id);
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    await query(sql, [hashedPassword, id]);
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Set reset token
  static async setResetToken(email, token, expires) {
    const sql = `
      UPDATE users 
      SET resetPasswordToken = ?, resetPasswordExpires = ? 
      WHERE email = ?
    `;
    await query(sql, [token, expires, email]);
  }

  // Find by reset token
  static async findByResetToken(token) {
    const sql = `
      SELECT * FROM users 
      WHERE resetPasswordToken = ? 
      AND resetPasswordExpires > NOW() 
      LIMIT 1
    `;
    const users = await query(sql, [token]);
    return users[0] || null;
  }

  // Clear reset token
  static async clearResetToken(id) {
    const sql = `
      UPDATE users 
      SET resetPasswordToken = NULL, resetPasswordExpires = NULL 
      WHERE id = ?
    `;
    await query(sql, [id]);
  }

  // Get all users (admin only)
  static async findAll(filters = {}) {
    let sql = 'SELECT id, name, email, role, avatar, isActive, createdAt FROM users WHERE 1=1';
    const params = [];

    if (filters.role) {
      sql += ' AND role = ?';
      params.push(filters.role);
    }

    if (filters.isActive !== undefined) {
      sql += ' AND isActive = ?';
      params.push(filters.isActive);
    }

    sql += ' ORDER BY createdAt DESC';

    return await query(sql, params);
  }

  // Delete user
  static async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    await query(sql, [id]);
  }

  // Get user statistics
  static async getStats(userId) {
    const sql = `
      SELECT 
        COUNT(*) as totalTasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedTasks,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingTasks,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as inProgressTasks,
        SUM(CASE WHEN dueDate < CURDATE() AND status != 'completed' THEN 1 ELSE 0 END) as overdueTasks
      FROM tasks 
      WHERE userId = ?
    `;
    const stats = await query(sql, [userId]);
    return stats[0];
  }
}

module.exports = User;
