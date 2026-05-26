import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { search, role, status, page: qPage = 1, limit: qLimit = 20 } = req.query;
    const page = parseInt(qPage, 10);
    const limit = parseInt(qLimit, 10);
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`,
      params
    );
    const total = countResult.total;

    // Get users
    const users = await query(
      `SELECT id, email, first_name as firstName, last_name as lastName, 
              phone, address, role, status, license_plate as licensePlate, 
              vehicle_model as vehicleModel, vehicle_color as vehicleColor,
              email_verified as emailVerified, created_at as createdAt,
              updated_at as updatedAt, last_login as lastLogin
       FROM users WHERE ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private/Admin
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await query(
      `SELECT id, email, first_name as firstName, last_name as lastName, 
              phone, address, role, status, license_plate as licensePlate, 
              vehicle_model as vehicleModel, vehicle_color as vehicleColor,
              email_verified as emailVerified, created_at as createdAt,
              updated_at as updatedAt, last_login as lastLogin
       FROM users WHERE id = ?`,
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private/Admin
router.put('/:id', authenticate, requireAdmin, [
  body('email').optional().isEmail().normalizeEmail(),
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('status').optional().isIn(['active', 'inactive', 'suspended'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { 
      email, firstName, lastName, phone, address, 
      licensePlate, vehicleModel, vehicleColor, status 
    } = req.body;

    // Check if user exists
    const existingUsers = await query('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check email uniqueness
    if (email) {
      const emailExists = await query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
      if (emailExists.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already in use' 
        });
      }
    }

    // Build update query
    const updates = [];
    const updateParams = [];

    if (email) { updates.push('email = ?'); updateParams.push(email); }
    if (firstName) { updates.push('first_name = ?'); updateParams.push(firstName); }
    if (lastName) { updates.push('last_name = ?'); updateParams.push(lastName); }
    if (phone !== undefined) { updates.push('phone = ?'); updateParams.push(phone); }
    if (address !== undefined) { updates.push('address = ?'); updateParams.push(address); }
    if (licensePlate !== undefined) { updates.push('license_plate = ?'); updateParams.push(licensePlate); }
    if (vehicleModel !== undefined) { updates.push('vehicle_model = ?'); updateParams.push(vehicleModel); }
    if (vehicleColor !== undefined) { updates.push('vehicle_color = ?'); updateParams.push(vehicleColor); }
    if (status) { updates.push('status = ?'); updateParams.push(status); }

    if (updates.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No fields to update' 
      });
    }

    updateParams.push(id);

    await query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      updateParams
    );

    // Log audit
    await query(
      `INSERT INTO audit_log (admin_id, action, target_type, target_id, ip_address) 
       VALUES (?, 'update', 'user', ?, ?)`,
      [req.user.id, id, req.ip]
    );

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      });
    }

    // Check if user exists
    const existingUsers = await query('SELECT id, email FROM users WHERE id = ?', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Log audit before deletion
    await query(
      `INSERT INTO audit_log (admin_id, action, target_type, target_id, old_value, ip_address) 
       VALUES (?, 'delete', 'user', ?, ?, ?)`,
      [req.user.id, id, JSON.stringify(existingUsers[0]), req.ip]
    );

    // Delete user (cascade will handle related records)
    await query('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/users/:id/password
// @desc    Update user password (Admin only)
// @access  Private/Admin
router.put('/:id/password', authenticate, requireAdmin, [
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { password } = req.body;

    // Check if user exists
    const existingUsers = await query('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await query(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
      [passwordHash, id]
    );

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users/stats/summary
// @desc    Get user statistics (Admin only)
// @access  Private/Admin
router.get('/stats/summary', authenticate, requireAdmin, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as totalUsers,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as adminCount,
        COUNT(CASE WHEN role = 'driver' THEN 1 END) as driverCount,
        COUNT(CASE WHEN role = 'owner' THEN 1 END) as ownerCount,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as activeUsers,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactiveUsers,
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspendedUsers,
        COUNT(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as activeThisWeek,
        COUNT(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as activeThisMonth
      FROM users
    `);

    const recentUsers = await query(`
      SELECT id, email, first_name as firstName, last_name as lastName, 
             role, status, created_at as createdAt, last_login as lastLogin
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        overview: stats[0],
        recentUsers
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

export default router;