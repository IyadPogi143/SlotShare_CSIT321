import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate, requireOwner } from '../middleware/auth.js';

const router = express.Router();

// GET /api/listings — public, returns active listings
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let sql = `SELECT l.*, u.first_name as ownerFirstName, u.last_name as ownerLastName
               FROM listings l
               JOIN users u ON l.user_id = u.id
               WHERE l.status = 'active'`;
    const params = [];
    if (search) {
      sql += ' AND (l.name LIKE ? OR l.address LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    sql += ' ORDER BY l.created_at DESC';
    const listings = await query(sql, params);
    res.json({ success: true, data: listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/listings/my — owner sees their own listings
router.get('/my', authenticate, requireOwner, async (req, res) => {
  try {
    const listings = await query(
      'SELECT * FROM listings WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/listings/:id — public
router.get('/:id', async (req, res) => {
  try {
    const listings = await query('SELECT * FROM listings WHERE id = ?', [req.params.id]);
    if (!listings.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: listings[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/listings — owners only
router.post('/', authenticate, requireOwner, [
  body('name').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('price_per_hour').isFloat({ min: 0 }),
  body('total_slots').isInt({ min: 1 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { name, address, description, price_per_hour, total_slots, amenities, rules } = req.body;
    const result = await query(
      `INSERT INTO listings (user_id, name, address, description, price_per_hour, total_slots, available_slots, status, amenities, rules)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [req.user.id, name, address, description || null, price_per_hour, total_slots, total_slots,
       amenities ? JSON.stringify(amenities) : null, rules || null]
    );
    res.status(201).json({ success: true, message: 'Listing created and pending review', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/listings/:id — owner can update their own listing
router.put('/:id', authenticate, requireOwner, async (req, res) => {
  try {
    const listings = await query('SELECT * FROM listings WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!listings.length) return res.status(404).json({ success: false, message: 'Listing not found or not yours' });

    const { name, address, description, price_per_hour, total_slots, amenities, rules, status } = req.body;
    await query(
      `UPDATE listings SET name=COALESCE(?,name), address=COALESCE(?,address), description=COALESCE(?,description),
       price_per_hour=COALESCE(?,price_per_hour), total_slots=COALESCE(?,total_slots),
       amenities=COALESCE(?,amenities), rules=COALESCE(?,rules), updated_at=NOW()
       WHERE id = ?`,
      [name, address, description, price_per_hour, total_slots,
       amenities ? JSON.stringify(amenities) : null, rules, req.params.id]
    );
    res.json({ success: true, message: 'Listing updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/listings/:id — owner can delete their own listing
router.delete('/:id', authenticate, requireOwner, async (req, res) => {
  try {
    const listings = await query('SELECT id FROM listings WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!listings.length) return res.status(404).json({ success: false, message: 'Not found or not yours' });
    await query('DELETE FROM listings WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;