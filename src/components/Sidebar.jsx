import React from 'react';
import { DashboardIcon, BrowseIcon, ListSpaceIcon, MyBookingsIcon, ProfileIcon, LogoutIcon, UsersIcon } from './Icons';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'browse', label: 'Browse Spaces', icon: BrowseIcon },
  { id: 'list-space', label: 'List Your Space', icon: ListSpaceIcon },
  { id: 'my-bookings', label: 'My Bookings', icon: MyBookingsIcon },
  { id: 'profile', label: 'Profile', icon: ProfileIcon },
];

function Sidebar({ activeTab, onTabChange, onLogout, userName, isAdmin, onAdminUsers }) {
  const items = isAdmin
    ? [...NAV_ITEMS, { id: 'users', label: 'Users', icon: UsersIcon }]
    : NAV_ITEMS;

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
            <span className="sidebar-user-role">Renter</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;