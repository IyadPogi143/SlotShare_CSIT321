import React, { useState } from 'react';
import { BrowseIcon } from '../components/Icons';
import { INITIAL_LISTINGS } from '../data';

function BrowseSpaces({ onBook, showToast }) {
  const [spaces] = useState(INITIAL_LISTINGS.filter(l => l.status === 'active'));
  const [search, setSearch] = useState('');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '', duration: '' });

  const filteredSpaces = spaces.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleBookClick = (space) => {
    setSelectedSpace(space);
    setBookingData({ date: '', time: '', duration: '' });
  };

  const handleConfirmBooking = () => {
    if (!bookingData.date || !bookingData.time || !bookingData.duration) {
      showToast('Please fill in all booking details');
      return;
    }
    
    const amount = selectedSpace.price * parseInt(bookingData.duration) || 0;
    onBook({
      listing: selectedSpace.name,
      renter: 'Current User', // Would come from auth context
      date: bookingData.date,
      time: bookingData.time,
      duration: bookingData.duration,
      amount: amount,
      status: 'pending'
    });
    setSelectedSpace(null);
    showToast('Booking request submitted successfully!');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <BrowseIcon />
          <h1 className="page-title">Browse Spaces</h1>
        </div>
        <div className="page-header-right">
          <span className="page-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="browse-search-bar">
        <input
          type="text"
          className="form-input browse-search-input"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="spaces-grid">
        {filteredSpaces.map(space => (
          <div key={space.id} className="space-card">
            <div className="space-card-image">
              <div className="space-card-placeholder">
                <BrowseIcon />
              </div>
              <span className={`space-card-status badge badge-${space.status}`}>{space.status}</span>
            </div>
            <div className="space-card-content">
              <h3 className="space-card-name">{space.name}</h3>
              <p className="space-card-address">{space.address}</p>
              <div className="space-card-details">
                <div className="space-card-detail">
                  <span className="space-card-detail-label">Available</span>
                  <span className="space-card-detail-value">{space.available}/{space.slots} slots</span>
                </div>
                <div className="space-card-detail">
                  <span className="space-card-detail-label">Price</span>
                  <span className="space-card-detail-value">₱{space.price}/hr</span>
                </div>
              </div>
              <button 
                className="btn-primary space-card-btn"
                onClick={() => handleBookClick(space)}
                disabled={space.available === 0}
              >
                {space.available === 0 ? 'No Availability' : 'Book Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSpaces.length === 0 && (
        <div className="empty-state">
          <BrowseIcon />
          <h3>No spaces found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedSpace && (
        <div className="modal-overlay" onClick={() => setSelectedSpace(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Book {selectedSpace.name}</h2>
              <button className="modal-close" onClick={() => setSelectedSpace(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="space-card-address" style={{ marginBottom: '20px' }}>
                {selectedSpace.address}
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Start Time *</label>
                <input 
                  type="time" 
                  className="form-input" 
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (hours) *</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={bookingData.duration}
                  onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                  min="1"
                  max={selectedSpace.slots}
                  placeholder="2"
                />
              </div>
              {bookingData.duration && (
                <div className="booking-total">
                  <span className="booking-total-label">Estimated Total</span>
                  <span className="booking-total-value">₱{(selectedSpace.price * parseInt(bookingData.duration)).toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setSelectedSpace(null)}>Cancel</button>
              <button className="btn-save" onClick={handleConfirmBooking}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseSpaces;