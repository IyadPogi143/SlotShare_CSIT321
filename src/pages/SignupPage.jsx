import React, { useState } from 'react';
import { ParkingLogoIcon } from '../components/Icons';
import { authAPI, setToken } from '../services/api';

function SignupPage({ onSignup, onLogin, onBack }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    adminCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    const { firstName, lastName, email, password, confirmPassword, phone, address, adminCode } = formData;
    
    if (!firstName || !lastName || !email || !password) { 
      setError("Please fill in all required fields."); 
      return; 
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.register({
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        adminCode
      });
      
      if (response.success) {
        setToken(response.token);
        onSignup(response.user);
      }
    } catch (apiError) {
      console.error('Registration error:', apiError);
      setError(apiError.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-dots">{Array.from({length: 200}).map((_,i) => <div key={i} className="auth-dot" />)}</div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, background: 'white', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ParkingLogoIcon />
          </div>
          <h2 className="auth-visual-title">Join SlotShare</h2>
          <p className="auth-visual-sub">Create an account to book or list parking spaces.</p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', alignSelf: 'flex-start', marginBottom: 8 }}>← Back to home</button>
          <div>
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Get started with SlotShare today</p>
          </div>
          {error && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--danger)', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 6, padding: '10px 14px' }}>{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input 
                className="form-input" 
                type="text" 
                name="firstName"
                value={formData.firstName} 
                onChange={handleChange} 
                placeholder="Juan" 
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input 
                className="form-input" 
                type="text" 
                name="lastName"
                value={formData.lastName} 
                onChange={handleChange} 
                placeholder="Dela Cruz" 
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              className="form-input" 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="you@example.com" 
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone (Optional)</label>
            <input 
              className="form-input" 
              type="tel" 
              name="phone"
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+63 917 123 4567" 
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address (Optional)</label>
            <input 
              className="form-input" 
              type="text" 
              name="address"
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Cebu City, Philippines" 
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Admin Code <span style={{ color: 'var(--muted)', fontWeight: 400, fontFamily: 'var(--font-mono)', fontSize: 11 }}>(leave blank for regular account)</span></label>
            <input 
              className="form-input" 
              type="text" 
              name="adminCode"
              value={formData.adminCode} 
              onChange={handleChange} 
              placeholder="Enter admin code if applicable" 
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              className="form-input" 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••" 
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              className="form-input" 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword} 
              onChange={handleChange} 
              placeholder="••••••••" 
              onKeyPress={handleKeyPress}
            />
          </div>

          <button className="btn-submit" onClick={handleSignup} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="auth-divider"><span>or</span></div>
          <p className="auth-switch">Already have an account? <button onClick={onLogin}>Sign in</button></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;