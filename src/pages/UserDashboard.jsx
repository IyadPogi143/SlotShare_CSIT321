import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BrowseSpaces from './BrowseSpaces';
import ListYourSpace from './ListYourSpace';
import MyBookings from './MyBookings';
import Profile from './Profile';
import Toast from '../components/Toast';
import { authAPI } from '../services/api';
import { INITIAL_BOOKINGS, INITIAL_LISTINGS } from '../data';

function UserDashboard({ onLogout, user: currentUser, isAdmin, userRole, onAdminUsers }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [myBookings, setMyBookings] = useState([]);       // bookings I made as driver
  const [incomingBookings, setIncomingBookings] = useState([]); // bookings on my listings as owner
  const [userListings, setUserListings] = useState([]);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (currentUser) {
      setUser({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        licensePlate: currentUser.licensePlate || '',
        vehicleModel: currentUser.vehicleModel || '',
        vehicleColor: currentUser.vehicleColor || '',
        role: currentUser.role || userRole || 'driver',
      });
    }
  }, [currentUser, userRole]);
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
              role: res.user.role || '',
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
    setMyBookings(prev => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId) => {
    setMyBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    ));
  };

  const handleAcceptBooking = (bookingId) => {
    setIncomingBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: 'confirmed' } : b
    ));
  };

  const handleRejectBooking = (bookingId) => {
    setIncomingBookings(prev => prev.map(b =>
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
  const role = user?.role || userRole;

  // Driver stats
  const totalMyBookings = myBookings.length;
  const activeMyBookings = myBookings.filter(b => b.status === 'confirmed').length;
  const totalSpent = myBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  // Owner stats
  const totalEarnings = incomingBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const availableSlots = userListings.reduce((sum, l) => sum + (l.available || 0), 0);
  const pendingRequests = incomingBookings.filter(b => b.status === 'pending').length;

  const recentBookings = role === 'owner'
    ? incomingBookings.slice(0, 3)
    : myBookings.slice(0, 3);
    
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      return (
    <div className="user-dashboard-content">
      <div className="dashboard-welcome">
        <h1 className="dashboard-greeting">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="dashboard-subtitle">
          {role === 'owner'
            ? "Here's what's happening with your parking spaces today"
            : "Here's what's happening with your bookings today"}
        </p>
        <span style={{
          display: 'inline-block',
          marginTop: 6,
          padding: '3px 10px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          background: role === 'owner' ? '#e0f2fe' : '#f0fdf4',
          color: role === 'owner' ? '#0369a1' : '#15803d',
        }}>
          {role === 'owner' ? '🅿️ Parking Owner' : '🚗 Driver'}
        </span>
      </div>

      {/* Quick Actions — role-aware */}
      <div className="quick-actions">
        {role === 'driver' && (
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
        )}
        {role === 'owner' && (
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
        )}
      </div>

      {/* Stats Grid — different per role */}
      <div className="stats-grid">
        {role === 'driver' ? (
          <>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">My Bookings</span>
              </div>
              <div className="stat-value">{totalMyBookings}</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Active Now</span>
              </div>
              <div className="stat-value">{activeMyBookings}</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Total Spent</span>
              </div>
              <div className="stat-value">₱{totalSpent.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat-value">
                {myBookings.filter(b => b.status === 'pending').length}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Total Earnings</span>
              </div>
              <div className="stat-value">₱{totalEarnings.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Pending Requests</span>
              </div>
              <div className="stat-value" style={{ color: pendingRequests > 0 ? '#d97706' : 'inherit' }}>
                {pendingRequests}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Available Slots</span>
              </div>
              <div className="stat-value">{availableSlots}</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">My Listings</span>
              </div>
              <div className="stat-value">{userListings.length}</div>
            </div>
          </>
        )}
      </div>

      {/* Recent section — role-aware */}
      <div className="recent-bookings-section">
        <div className="section-header">
          <h2 className="section-title">
            {role === 'owner' ? 'Recent Booking Requests' : 'My Recent Bookings'}
          </h2>
          <span className="section-subtitle">
            {role === 'owner'
              ? 'Latest requests on your spaces'
              : 'Your latest parking reservations'}
          </span>
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
                  {role === 'owner' && (
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                      Driver: <strong>{booking.renter}</strong>
                    </p>
                  )}
                  <span className={`booking-status status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div className="booking-amount">₱{booking.amount}</div>
                  {role === 'owner' && booking.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleAcceptBooking(booking.id)}
                        style={{ fontSize: 11, padding: '3px 8px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectBooking(booking.id)}
                        style={{ fontSize: 11, padding: '3px 8px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-bookings">
              <p>
                {role === 'owner'
                  ? 'No booking requests yet. List a space to get started!'
                  : 'No recent bookings. Browse spaces to book one!'}
              </p>
            </div>
          )}
        </div>
        <button
          className="view-all-btn"
          onClick={() => setActiveTab('my-bookings')}
        >
          {role === 'owner' ? 'View All Requests' : 'View All Bookings'}
        </button>
      </div>

      <div className="ccto-compliance">
        <div className="ccto-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 11 14 15 10"></polyline>
          </svg>
        </div>
        <div className="ccto-text">
          <strong>CCTO Compliant (City Ordinance 2087)</strong>
          <p>All parking spaces listed on SlotShare comply with Cebu City Traffic Operations Management (CCTO) regulations.</p>
        </div>
      </div>
    </div>
  );
      case 'browse':
        if (role !== 'driver') {
          return (
            <div className="user-dashboard-content">
              <h2>Access Denied</h2>
              <p>Only drivers can browse parking spaces.</p>
            </div>
          );
        }

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
          role={role}
          myBookings={myBookings}
          incomingBookings={incomingBookings}
          onCancelBooking={handleCancelBooking}
          onAcceptBooking={handleAcceptBooking}
          onRejectBooking={handleRejectBooking}
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
        userName={user?.firstName}
        isAdmin={isAdmin}
        userRole={user?.role || userRole}
        onAdminUsers={onAdminUsers}
      />
      <main className="user-dashboard-main">
        {renderContent()}
      </main>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

export default UserDashboard;