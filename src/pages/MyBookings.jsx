import React, { useState } from 'react';
import { MyBookingsIcon } from '../components/Icons';

function MyBookings({ bookings, onCancelBooking, showToast }) {
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled, completed

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed': return 'badge-active';
      case 'pending': return 'badge-pending';
      case 'cancelled': return 'badge-inactive';
      case 'completed': return 'badge-active';
      default: return 'badge-pending';
    }
  };

  const handleCancel = (booking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      onCancelBooking(booking.id);
      showToast('Booking cancelled successfully');
    }
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const totalSpent = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.amount, 0);
    return { total, pending, confirmed, completed, totalSpent };
  };

  const stats = getBookingStats();

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <MyBookingsIcon />
          <h1 className="page-title">My Bookings</h1>
        </div>
        <div className="page-header-right">
          <span className="page-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bookings-stats">
        <div className="booking-stat-card">
          <span className="booking-stat-value">{stats.total}</span>
          <span className="booking-stat-label">Total Bookings</span>
        </div>
        <div className="booking-stat-card">
          <span className="booking-stat-value">{stats.pending}</span>
          <span className="booking-stat-label">Pending</span>
        </div>
        <div className="booking-stat-card">
          <span className="booking-stat-value">{stats.confirmed}</span>
          <span className="booking-stat-label">Confirmed</span>
        </div>
        <div className="booking-stat-card">
          <span className="booking-stat-value">₱{stats.totalSpent.toLocaleString()}</span>
          <span className="booking-stat-label">Total Spent</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span className="filter-tab-count">
                {bookings.filter(b => b.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <MyBookingsIcon />
            <h3>No bookings found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't made any bookings yet. Browse spaces to get started!" 
                : `No ${filter} bookings.`}
            </p>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card-left">
                <div className="booking-card-date">
                  <span className="booking-card-day">
                    {new Date(booking.date).toLocaleDateString('en-US', { day: 'numeric' })}
                  </span>
                  <span className="booking-card-month">
                    {new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>
              </div>
              <div className="booking-card-middle">
                <h3 className="booking-card-title">{booking.listing}</h3>
                <div className="booking-card-details">
                  <span className="booking-card-detail">
                    🕐 {booking.time} • {booking.duration}
                  </span>
                  <span className="booking-card-detail">
                    📅 {new Date(booking.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="booking-card-renter">
                  Booked by: <strong>{booking.renter}</strong>
                </div>
              </div>
              <div className="booking-card-right">
                <span className="booking-card-amount">₱{booking.amount.toLocaleString()}</span>
                <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status}
                </span>
                {booking.status === 'pending' && (
                  <button 
                    className="btn-cancel-booking"
                    onClick={() => handleCancel(booking)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBookings;