import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate, requireDriver, requireOwner } from '../middleware/auth.js';

const router = express.Router();

// POST /api/bookings — drivers create a booking
router.post('/', authenticate, requireDriver, [
  body('listing_id').isInt(),
  body('booking_date').isDate(),
  body('start_time').notEmpty(),
  body('duration_hours').isInt({ min: 1 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { listing_id, booking_date, start_time, duration_hours } = req.body;

    // Get listing to calculate price and check availability
    const listings = await query('SELECT * FROM listings WHERE id = ? AND status = "active"', [listing_id]);
    if (!listings.length) return res.status(404).json({ success: false, message: 'Listing not found or not active' });

    const listing = listings[0];
    if (listing.available_slots < 1) return res.status(400).json({ success: false, message: 'No available slots' });

    const amount = listing.price_per_hour * duration_hours;
    const renter_name = `${req.user.email}`; // or pull full name from users table

    // Get user's full name for renter_name
    const users = await query('SELECT first_name, last_name FROM users WHERE id = ?', [req.user.id]);
    const fullName = users.length ? `${users[0].first_name} ${users[0].last_name}` : req.user.email;

    const result = await query(
      `INSERT INTO bookings (listing_id, user_id, renter_name, booking_date, start_time, duration_hours, amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [listing_id, req.user.id, fullName, booking_date, start_time, duration_hours, amount]
    );

    // Decrement available slots
    await query('UPDATE listings SET available_slots = available_slots - 1 WHERE id = ?', [listing_id]);

    res.status(201).json({ success: true, message: 'Booking created', id: result.insertId, amount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/bookings/as-renter — driver sees their own bookings
router.get('/as-renter', authenticate, requireDriver, async (req, res) => {
  try {
    const bookings = await query(
      `SELECT b.*, l.name as listingName, l.address as listingAddress
       FROM bookings b JOIN listings l ON b.listing_id = l.id
       WHERE b.user_id = ? ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/bookings/as-owner — owner sees bookings on their listings
router.get('/as-owner', authenticate, requireOwner, async (req, res) => {
  try {
    const bookings = await query(
      `SELECT b.*, l.name as listingName, l.address as listingAddress
       FROM bookings b
       JOIN listings l ON b.listing_id = l.id
       WHERE l.user_id = ? ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/bookings/:id/accept — owner accepts
router.patch('/:id/accept', authenticate, requireOwner, async (req, res) => {
  try {
    // Verify the booking belongs to owner's listing
    const bookings = await query(
      `SELECT b.* FROM bookings b JOIN listings l ON b.listing_id = l.id
       WHERE b.id = ? AND l.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (!bookings.length) return res.status(404).json({ success: false, message: 'Booking not found' });
    await query('UPDATE bookings SET status = "confirmed" WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Booking confirmed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/bookings/:id/reject — owner rejects
router.patch('/:id/reject', authenticate, requireOwner, async (req, res) => {
  try {
    const bookings = await query(
      `SELECT b.* FROM bookings b JOIN listings l ON b.listing_id = l.id
       WHERE b.id = ? AND l.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (!bookings.length) return res.status(404).json({ success: false, message: 'Booking not found' });
    await query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [req.params.id]);
    // Restore available slot
    await query('UPDATE listings SET available_slots = available_slots + 1 WHERE id = ?', [bookings[0].listing_id]);
    res.json({ success: true, message: 'Booking rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/bookings/:id/cancel — driver cancels their own booking
router.patch('/:id/cancel', authenticate, requireDriver, async (req, res) => {
  try {
    const bookings = await query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!bookings.length) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (bookings[0].status === 'cancelled') return res.status(400).json({ success: false, message: 'Already cancelled' });
    await query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [req.params.id]);
    await query('UPDATE listings SET available_slots = available_slots + 1 WHERE id = ?', [bookings[0].listing_id]);
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;