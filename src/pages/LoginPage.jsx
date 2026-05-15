import React, { useState } from 'react';
import { ParkingLogoIcon } from '../components/Icons';
import { authAPI, setToken } from '../services/api';

function LoginPage({ onLogin, onSignup, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { 
      setError("Please fill in all fields."); 
      return; 
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        // Store token
        setToken(response.token);
        
        // Call onLogin with user role for routing
        onLogin(response.user);
      }
    } catch (apiError) {
      console.error('Login error:', apiError);
      setError(apiError.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
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
          <h2 className="auth-visual-title">SlotShare</h2>
          <p className="auth-visual-sub">The smartest way to find and list parking spaces in Cebu City.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, width: '100%', maxWidth: 280, marginTop: 24 }}>
            {["8 listings", "120+ users", "4.9★ rating"].map(s => (
              <div key={s} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 10px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'white' }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', alignSelf: 'flex-start', marginBottom: 8 }}>← Back to home</button>
          <div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your SlotShare account</p>
          </div>
          {error && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--danger)', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 6, padding: '10px 14px' }}>{error}</div>}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              className="form-input" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              className="form-input" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              onKeyPress={handleKeyPress}
            />
          </div>
          <button className="btn-submit" onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <div className="auth-divider"><span>or</span></div>
          <p className="auth-switch">Don't have an account? <button onClick={onSignup}>Sign up free</button></p>
          
          {/* Demo credentials hint */}
          <div style={{ marginTop: 16, padding: 12, background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Demo Credentials:</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)' }}>
              Admin: admin@slotshare.com / admin123<br/>
              User: user@slotshare.com / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;