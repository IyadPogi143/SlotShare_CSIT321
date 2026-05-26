import React from 'react';
import { DashboardIcon, BrowseIcon, ListSpaceIcon, MyBookingsIcon, ProfileIcon, LogoutIcon, UsersIcon } from './Icons';

const DRIVER_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'browse', label: 'Browse Spaces', icon: BrowseIcon },
  { id: 'my-bookings', label: 'My Bookings', icon: MyBookingsIcon },
  { id: 'profile', label: 'Profile', icon: ProfileIcon },
];

const OWNER_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'list-space', label: 'Add Listing', icon: ListSpaceIcon },
  { id: 'my-bookings', label: 'Booking Requests', icon: MyBookingsIcon },
  { id: 'profile', label: 'Profile', icon: ProfileIcon },
];

function Sidebar({ activeTab, onTabChange, onLogout, userName, isAdmin, userRole, onAdminUsers }) {
const baseNav = userRole === 'owner' ? OWNER_NAV : DRIVER_NAV;
const items = isAdmin
  ? [...baseNav, { id: 'users', label: 'Users', icon: UsersIcon }]
  : baseNav;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">SlotShare</div>
      <nav className="sidebar-nav">
        {items.map(item => {
          const Icon = item.icon;
          const handleClick = item.id === 'users' ? (onAdminUsers || (() => {})) : () => onTabChange(item.id);
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={handleClick}
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
            <span className="sidebar-user-role" style={{ textTransform: 'capitalize' }}>
              {userRole || 'User'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;