import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BrowseSpaces from './BrowseSpaces';
import ListYourSpace from './ListYourSpace';
import MyBookings from './MyBookings';
import Profile from './Profile';
import Toast from '../components/Toast';
import { authAPI } from '../services/api';
import { INITIAL_BOOKINGS, INITIAL_LISTINGS } from '../data';

function UserDashboard({ onLogout, user: currentUser }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userBookings, setUserBookings] = useState(INITIAL_BOOKINGS);
  const [userListings, setUserListings] = useState(INITIAL_LISTINGS);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(currentUser ? {
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    email: currentUser.email || '',
  } : null);

  useEffect(() => {
    if (!user) {
      authAPI.getCurrentUser()
        .then(res => {
          if (res.success && res.user) {
            setUser({
              firstName: res.user.firstName || '',
              lastName: res.user.lastName || '',
              email: res.user.email || '',
              phone: res.user.phone || '',
              address: res.user.address || '',
              licensePlate: res.user.licensePlate || '',
              vehicleModel: res.user.vehicleModel || '',
              vehicleColor: res.user.vehicleColor || '',
            });
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const showToast = (message) => {
    setToast(message);
  };

  const handleBook = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Date.now()
    };
    setUserBookings(prev => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId) => {
    setUserBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    ));
  };

  const handleListSpace = (listingData) => {
    const newListing = {
      ...listingData,
      id: Date.now()
    };
    setUserListings(prev => [...prev, newListing]);
  };

  const handleUpdateProfile = (updatedData) => {
    setUser(updatedData);
  };

  // Calculate stats
  const totalBookings = userBookings.length;
  const activeBookings = userBookings.filter(b => b.status === 'confirmed' || b.status === 'active').length;
  const totalEarnings = userBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const availableSlots = userListings.reduce((sum, l) => sum + (l.available || 0), 0);

  // Recent bookings (limited to 3)
  const recentBookings = userBookings.slice(0, 3);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="user-dashboard-content">
            {/* Welcome Section */}
            <div className="dashboard-welcome">
              <h1 className="dashboard-greeting">Welcome back!</h1>
              <p className="dashboard-subtitle">Here's what's happening with your parking today</p>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <div className="action-card" onClick={() => setActiveTab('browse')}>
                <div className="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h3 className="action-title">Find Parking</h3>
                <p className="action-description">Browse available spaces near you</p>
              </div>
              <div className="action-card" onClick={() => setActiveTab('list-space')}>
                <div className="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                  </svg>
                </div>
                <h3 className="action-title">List Your Space</h3>
                <p className="action-description">Start earning from your parking space</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Total Bookings</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div className="stat-value">{totalBookings}</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Active Now</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div className="stat-value">{activeBookings}</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Total Earnings</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="stat-value">₱{totalEarnings.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Available Slots</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                    <circle cx="7" cy="17" r="2"></circle>
                    <circle cx="17" cy="17" r="2"></circle>
                  </svg>
                </div>
                <div className="stat-value">{availableSlots}</div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="recent-bookings-section">
              <div className="section-header">
                <h2 className="section-title">Recent Bookings</h2>
                <span className="section-subtitle">Your latest parking reservations</span>
              </div>
              <div className="bookings-list">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-info">
                        <h4 className="booking-name">{booking.listing}</h4>
                        <p className="booking-details">
                          {booking.date} • {booking.time || 'All day'}
                        </p>
                        <span className={`booking-status status-${booking.status}`}>
                          {booking.status === 'confirmed' ? 'active' : booking.status === 'pending' ? 'upcoming' : booking.status}
                        </span>
                      </div>
                      <div className="booking-amount">₱{booking.amount}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-bookings">
                    <p>No recent bookings found</p>
                  </div>
                )}
              </div>
              <button 
                className="view-all-btn"
                onClick={() => setActiveTab('my-bookings')}
              >
                View All Bookings
              </button>
            </div>

            {/* CCTO Compliance Footer */}
            <div className="ccto-compliance">
              <div className="ccto-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="9 12 11 14 15 10"></polyline>
                </svg>
              </div>
              <div className="ccto-text">
                <strong>CCTO Compliant (City Ordinance 2087)</strong>
                <p>All parking spaces listed on SlotShare comply with Cebu City Traffic Operations Management (CCTO) regulations and City Ordinance 2087, ensuring fair pricing and proper parking standards.</p>
              </div>
            </div>
          </div>
        );
      case 'browse':
        return (
          <BrowseSpaces 
            onBook={handleBook}
            showToast={showToast}
          />
        );
      case 'list-space':
        return (
          <ListYourSpace 
            onSubmit={handleListSpace}
            showToast={showToast}
          />
        );
      case 'my-bookings':
        return (
          <MyBookings 
            bookings={userBookings}
            onCancelBooking={handleCancelBooking}
            showToast={showToast}
          />
        );
      case 'profile':
        return (
          <Profile 
            user={user}
            onUpdateProfile={handleUpdateProfile}
            showToast={showToast}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-dashboard-layout">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        userName={user.firstName}
      />
      <main className="user-dashboard-main">
        {renderContent()}
      </main>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

export default UserDashboard;