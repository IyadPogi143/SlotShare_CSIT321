import React, { useState } from 'react';
import { ProfileIcon } from '../components/Icons';

function Profile({ user, onUpdateProfile, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Juan',
    lastName: user?.lastName || 'Dela Cruz',
    email: user?.email || 'juan.delacruz@example.com',
    phone: user?.phone || '+63 917 123 4567',
    address: user?.address || 'Cebu City, Philippines',
    licensePlate: user?.licensePlate || 'ABC 1234',
    vehicleModel: user?.vehicleModel || 'Toyota Vios',
    vehicleColor: user?.vehicleColor || 'Silver'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    showToast('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || 'Juan',
      lastName: user?.lastName || 'Dela Cruz',
      email: user?.email || 'juan.delacruz@example.com',
      phone: user?.phone || '+63 917 123 4567',
      address: user?.address || 'Cebu City, Philippines',
      licensePlate: user?.licensePlate || 'ABC 1234',
      vehicleModel: user?.vehicleModel || 'Toyota Vios',
      vehicleColor: user?.vehicleColor || 'Silver'
    });
    setIsEditing(false);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <ProfileIcon />
          <h1 className="page-title">Profile</h1>
        </div>
        <div className="page-header-right">
          <span className="page-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{formData.firstName} {formData.lastName}</h2>
            <p className="profile-email">{formData.email}</p>
            <span className="badge badge-active">Active Member</span>
          </div>
          {!isEditing && (
            <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-content">
          {/* Personal Information */}
          <div className="profile-section">
            <h3 className="profile-section-title">Personal Information</h3>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    className="form-input" 
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    className="form-input" 
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-input" 
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  className="form-input" 
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input 
                  type="text" 
                  name="address"
                  className="form-input" 
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </form>
          </div>

          {/* Vehicle Information */}
          <div className="profile-section">
            <h3 className="profile-section-title">Vehicle Information</h3>
            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">License Plate</label>
                  <input 
                    type="text" 
                    name="licensePlate"
                    className="form-input" 
                    value={formData.licensePlate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="ABC 1234"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Vehicle Model</label>
                  <input 
                    type="text" 
                    name="vehicleModel"
                    className="form-input" 
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Toyota Vios"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Color</label>
                <input 
                  type="text" 
                  name="vehicleColor"
                  className="form-input" 
                  value={formData.vehicleColor}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Silver"
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="profile-section">
            <h3 className="profile-section-title">Account Settings</h3>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Password</span>
                  <span className="setting-value">Last changed 30 days ago</span>
                </div>
                <button className="btn-setting-action">Change</button>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Payment Methods</span>
                  <span className="setting-value">1 card saved</span>
                </div>
                <button className="btn-setting-action">Manage</button>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Notifications</span>
                  <span className="setting-value">Email & SMS enabled</span>
                </div>
                <button className="btn-setting-action">Configure</button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="profile-section danger-zone">
            <h3 className="profile-section-title">Danger Zone</h3>
            <div className="danger-actions">
              <div className="danger-item">
                <div className="danger-info">
                  <span className="danger-label">Delete Account</span>
                  <span className="danger-value">Permanently delete your account and all data</span>
                </div>
                <button className="btn-danger-action">Delete Account</button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="profile-actions">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn-save" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;