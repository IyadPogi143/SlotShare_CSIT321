import React, { useState, useEffect } from 'react';
import { ParkingIcon, BookingsIcon, OverviewIcon, LogoutIcon } from '../components/Icons';
import { usersAPI, authAPI } from '../services/api';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

// Local icon definitions
const UsersIconLocal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const SettingsIconLocal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

function AdminDashboard({ onLogout, user }) {
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [stats, setStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'user',
    adminCode: '',
  });

  const showToast = (message) => setToast(message);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (roleFilter !== 'all') params.role = roleFilter;

      const response = await usersAPI.getAll(params);
      if (response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await usersAPI.getStats();
      if (response.success) {
        setStats(response.data.overview);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [pagination.page, search, statusFilter, roleFilter]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await usersAPI.update(userId, { status: newStatus });
      showToast(`User ${newStatus === 'active' ? 'activated' : newStatus === 'suspended' ? 'suspended' : 'deactivated'} successfully`);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error updating user:', error);
      showToast(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await usersAPI.delete(userId);
      showToast('User deleted successfully');
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast(error.message || 'Failed to delete user');
    }
  };

  const handleEditUser = (userData) => {
    setEditFormData({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || '',
      status: userData.status
    });
    setSelectedUser(userData);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await usersAPI.update(selectedUser.id, editFormData);
      showToast('User updated successfully');
      setShowEditModal(false);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error updating user:', error);
      showToast(error.message || 'Failed to save changes');
      setShowEditModal(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const userData = {
        email: addFormData.email,
        password: addFormData.password,
        firstName: addFormData.firstName,
        lastName: addFormData.lastName,
        phone: addFormData.phone || undefined,
        role: addFormData.role,
      };

      if (addFormData.role === 'admin' && addFormData.adminCode) {
        userData.adminCode = addFormData.adminCode;
      }

      const response = await authAPI.register(userData);
      showToast(response.message || 'User created successfully');
      setShowAddModal(false);
      setAddFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'user', adminCode: '' });
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error creating user:', error);
      showToast(error.message || 'Failed to create user');
    }
  };

  const NAV = [
    { id: 'overview', label: 'Overview', icon: <OverviewIcon /> },
    { id: 'users', label: 'Users', icon: <UsersIconLocal /> },
    { id: 'listings', label: 'Listings', icon: <ParkingIcon /> },
    { id: 'bookings', label: 'Bookings', icon: <BookingsIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIconLocal /> },
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'badge-active';
      case 'inactive': return 'badge-inactive';
      case 'suspended': return 'badge-pending';
      default: return 'badge-pending';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-logo">SlotShare Admin</div>
        <nav className="dash-nav">
          {NAV.map(n => (
            <button key={n.id} className={`dash-nav-item ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button className="dash-nav-item" onClick={onLogout} style={{ marginTop: 'auto', color: 'var(--danger)' }}>
            <LogoutIcon /> Sign out
          </button>
        </nav>
        <div className="dash-user">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--text)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{user?.firstName || 'Admin'} {user?.lastName || 'User'}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <span className="dash-page-title">
            {tab === 'overview' && 'Admin Overview'}
            {tab === 'users' && 'User Management'}
            {tab === 'listings' && 'Parking Listings'}
            {tab === 'bookings' && 'All Bookings'}
            {tab === 'settings' && 'Settings'}
          </span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="dash-content">
          {tab === 'overview' && stats && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Users</div>
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-change up">{stats.adminCount} admins, {stats.userCount} users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Users</div>
                  <div className="stat-value">{stats.activeUsers}</div>
                  <div className="stat-change">{stats.activeThisWeek} active this week</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Inactive Users</div>
                  <div className="stat-value">{stats.inactiveUsers}</div>
                  <div className="stat-change">Requires attention</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Suspended Users</div>
                  <div className="stat-value">{stats.suspendedUsers}</div>
                  <div className="stat-change down">Review required</div>
                </div>
              </div>

              <div className="table-card">
                <div className="table-card-header">
                  <span className="table-card-title">Recent Users</span>
                  <button className="btn-add" onClick={() => setTab('users')}>View all</button>
                </div>
                <table className="data-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th></tr></thead>
                  <tbody>
                    {users.slice(0, 5).map(u => (
                      <tr key={u.id}>
                        <td className="td-name">{u.firstName} {u.lastName}</td>
                        <td className="td-mono">{u.email}</td>
                        <td><span className={`badge ${u.role === 'admin' ? 'badge-active' : 'badge-pending'}`}>{u.role}</span></td>
                        <td><span className={`badge ${getStatusBadgeClass(u.status)}`}>{u.status}</span></td>
                        <td className="td-mono">{formatDate(u.lastLogin)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'users' && (
            <div className="table-card">
              <div className="table-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
                <span className="table-card-title">All Users ({pagination.total})</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className="table-search"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 200 }}
                  />
                  <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 120 }}>
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <button className="btn-add" onClick={() => { setAddFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'user', adminCode: '' }); setShowAddModal(true); }}>+ Add User</button>
                   <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ width: 120 }}>
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
              ) : (
                <>
                  <table className="data-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td className="td-name">{u.firstName} {u.lastName}</td>
                          <td className="td-mono">{u.email}</td>
                          <td className="td-mono">{u.phone || '-'}</td>
                          <td><span className={`badge ${u.role === 'admin' ? 'badge-active' : 'badge-pending'}`}>{u.role}</span></td>
                          <td><span className={`badge ${getStatusBadgeClass(u.status)}`}>{u.status}</span></td>
                          <td className="td-mono">{formatDate(u.createdAt)}</td>
                          <td className="row-actions">
                            <button className="btn-edit" onClick={() => handleEditUser(u)}>Edit</button>
                            {u.status === 'active' ? (
                              <button className="btn-delete" onClick={() => handleStatusChange(u.id, 'inactive')}>Deactivate</button>
                            ) : u.status === 'inactive' ? (
                              <button className="btn-edit" onClick={() => handleStatusChange(u.id, 'active')}>Activate</button>
                            ) : null}
                            {u.status !== 'suspended' && u.role !== 'admin' && (
                              <button className="btn-delete" onClick={() => handleStatusChange(u.id, 'suspended')}>Suspend</button>
                            )}
                            <button className="btn-delete" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {pagination.pages > 1 && (
                    <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>
                        Page {pagination.page} of {pagination.pages}
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-edit" disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>Previous</button>
                        <button className="btn-edit" disabled={pagination.page === pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>Next</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {tab === 'listings' && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
              <ParkingIcon />
              <h3 style={{ marginTop: 16, fontFamily: 'var(--font-display)' }}>Listings Management</h3>
              <p>Listings management coming soon...</p>
            </div>
          )}

          {tab === 'bookings' && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
              <BookingsIcon />
              <h3 style={{ marginTop: 16, fontFamily: 'var(--font-display)' }}>Bookings Management</h3>
              <p>Bookings management coming soon...</p>
            </div>
          )}

          {tab === 'settings' && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
              <SettingsIconLocal />
              <h3 style={{ marginTop: 16, fontFamily: 'var(--font-display)' }}>Settings</h3>
              <p>System settings coming soon...</p>
            </div>
          )}
        </div>
      </main>

      {showEditModal && (
        <Modal title="Edit User" onClose={() => setShowEditModal(false)} onConfirm={handleSaveEdit} confirmLabel="Save Changes">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" value={editFormData.firstName} onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" value={editFormData.lastName} onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={editFormData.phone} onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </Modal>
      )}

      {showAddModal && (
        <Modal title="Add User" onClose={() => setShowAddModal(false)} onConfirm={handleAddUser} confirmLabel="Create User">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={addFormData.email} onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={addFormData.password} onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" value={addFormData.firstName} onChange={(e) => setAddFormData({ ...addFormData, firstName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" value={addFormData.lastName} onChange={(e) => setAddFormData({ ...addFormData, lastName: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={addFormData.phone} onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" value={addFormData.role} onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {addFormData.role === 'admin' && (
            <div className="form-group">
              <label className="form-label">Admin Code</label>
              <input className="form-input" type="password" value={addFormData.adminCode} onChange={(e) => setAddFormData({ ...addFormData, adminCode: e.target.value })} placeholder="Enter admin code" />
            </div>
          )}
        </Modal>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

export default AdminDashboard;