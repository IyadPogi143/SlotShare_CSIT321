import React from 'react';
import { DashboardIcon, BrowseIcon, ListSpaceIcon, MyBookingsIcon, ProfileIcon, LogoutIcon } from './Icons';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'browse', label: 'Browse Spaces', icon: BrowseIcon },
  { id: 'list-space', label: 'List Your Space', icon: ListSpaceIcon },
  { id: 'my-bookings', label: 'My Bookings', icon: MyBookingsIcon },
  { id: 'profile', label: 'Profile', icon: ProfileIcon },
];

function Sidebar({ activeTab, onTabChange, onLogout, userName }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">SlotShare</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon /> {item.label}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-nav-item logout" onClick={onLogout}>
          <LogoutIcon /> Logout
        </button>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{userName || 'User'}</span>
            <span className="sidebar-user-role">Renter</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;