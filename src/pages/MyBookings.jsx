import React, { useState } from 'react';
import { MyBookingsIcon } from '../components/Icons';
import { bookingsAPI, listingsAPI } from '../services/api';

function MyBookings({ role, myBookings = [], incomingBookings = [], onCancelBooking, onAcceptBooking, onRejectBooking, showToast }) {
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('mine'); // 'mine' = as driver, 'incoming' = as owner

  const activeList = role === 'owner' && view === 'incoming'
    ? incomingBookings
    : myBookings;

  const filteredBookings = activeList.filter(b => {
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
  const total = activeList.length;
  const pending = activeList.filter(b => b.status === 'pending').length;
  const confirmed = activeList.filter(b => b.status === 'confirmed').length;
  const completed = activeList.filter(b => b.status === 'completed').length;
  const totalAmount = activeList
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.amount, 0);
  return { total, pending, confirmed, completed, totalAmount };
};

  const stats = getBookingStats();

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <MyBookingsIcon />
          <h1 className="page-title">
            {role === 'owner' ? 'Bookings' : 'My Bookings'}
          </h1>
        </div>
        <div className="page-header-right">
          <span className="page-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
{role === 'owner' && (
  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
    <button
      onClick={() => setView('mine')}
      style={{
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        fontWeight: 600,
        background: view === 'mine' ? 'var(--primary)' : '#f1f5f9',
        color: view === 'mine' ? 'white' : 'var(--text)',
      }}
    >
      🚗 My Bookings as Driver
      <span style={{ marginLeft: 6, opacity: 0.8 }}>({myBookings.length})</span>
    </button>
    <button
      onClick={() => setView('incoming')}
      style={{
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        fontWeight: 600,
        background: view === 'incoming' ? 'var(--primary)' : '#f1f5f9',
        color: view === 'incoming' ? 'white' : 'var(--text)',
        position: 'relative',
      }}
    >
      🅿️ Requests on My Spaces
      {incomingBookings.filter(b => b.status === 'pending').length > 0 && (
        <span style={{
          marginLeft: 6,
          background: '#dc2626',
          color: 'white',
          borderRadius: 10,
          padding: '0 6px',
          fontSize: 11,
        }}>
          {incomingBookings.filter(b => b.status === 'pending').length}
        </span>
      )}
    </button>
  </div>
)}

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
          <span className="booking-stat-value">₱{stats.totalAmount.toLocaleString()}</span>
          <span className="booking-stat-label">
            {role === 'owner' && view === 'incoming' ? 'Total Earned' : 'Total Spent'}
          </span>
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
                {activeList.filter(b => b.status === f).length}
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
                ? view === 'incoming'
                  ? "No booking requests on your spaces yet."
                  : "You haven't made any bookings yet. Browse spaces to get started!"
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
                  {view === 'incoming'
                    ? <>Driver: <strong>{booking.renter}</strong></>
                    : <>Space: <strong>{booking.listing}</strong></>
                  }
                </div>
              </div>
              <div className="booking-card-right">
                <span className="booking-card-amount">₱{booking.amount.toLocaleString()}</span>
                <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status}
                </span>
                {view === 'incoming' && booking.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <button
                      style={{ fontSize: 12, padding: '4px 10px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                      onClick={() => { onAcceptBooking(booking.id); showToast('Booking accepted!'); }}
                    >
                      Accept
                    </button>
                    <button
                      style={{ fontSize: 12, padding: '4px 10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                      onClick={() => { onRejectBooking(booking.id); showToast('Booking rejected.'); }}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  booking.status === 'pending' && view === 'mine' && (
                    <button
                      className="btn-cancel-booking"
                      onClick={() => handleCancel(booking)}
                    >
                      Cancel
                    </button>
                  )
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