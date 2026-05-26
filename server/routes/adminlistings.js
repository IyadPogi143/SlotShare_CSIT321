/**
 * Admin Listings Routes
 * GET    /api/admin/listings          — all listings (paginated, filterable)
 * PATCH  /api/admin/listings/:id/status — approve / reject / activate / deactivate
 * DELETE /api/admin/listings/:id      — hard-delete a listing
 *
 * All routes require: authenticate + requireAdmin
 */

import express from 'express';
import { query } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply auth guards to every route in this file
router.use(authenticate, requireAdmin);

// ─── GET /api/admin/listings ──────────────────────────────────────────────────
// Query params: search, status, page, limit
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      status = 'all',
      page = 1,
      limit = 20,
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const params = [];

    let where = 'WHERE 1=1';
    if (status !== 'all') {
      where += ' AND l.status = ?';
      params.push(status);
    }
    if (search) {
      where += ' AND (l.name LIKE ? OR l.address LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)';
      const like = `%${search}%`;
      params.push(like, like, like, like);
    }

    const countResult = await query(
      `SELECT COUNT(*) AS total
       FROM listings l
       JOIN users u ON l.user_id = u.id
       ${where}`,
      params
    );
    const total = countResult[0].total;

    const listings = await query(
      `SELECT
         l.id,
         l.name,
         l.address,
         l.price_per_hour,
         l.total_slots,
         l.available_slots,
         l.status,
         l.created_at,
         l.updated_at,
         u.id          AS ownerId,
         u.first_name  AS ownerFirstName,
         u.last_name   AS ownerLastName,
         u.email       AS ownerEmail
       FROM listings l
       JOIN users u ON l.user_id = u.id
       ${where}
       ORDER BY l.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    res.json({
      success: true,
      data: listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Admin listings fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PATCH /api/admin/listings/:id/status ────────────────────────────────────
// body: { status: 'active' | 'inactive' | 'pending' }
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const allowed = ['active', 'inactive', 'pending'];

  if (!allowed.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${allowed.join(', ')}`,
    });
  }

  try {
    const rows = await query('SELECT id FROM listings WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    await query(
      'UPDATE listings SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, req.params.id]
    );

    const label = status === 'active' ? 'approved' : status === 'inactive' ? 'rejected' : 'set to pending';
    res.json({ success: true, message: `Listing ${label} successfully` });
  } catch (error) {
    console.error('Admin listing status update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/admin/listings/:id ──────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT id FROM listings WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    await query('DELETE FROM listings WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Admin listing delete error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;