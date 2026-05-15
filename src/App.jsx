import React, { useState, useEffect } from 'react';
import './styles.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { getUserFromToken, removeToken, authAPI } from './services/api';

function App() {
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);

  // Check for existing session on mount — always resolve from /auth/me
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = getUserFromToken();
      if (decoded) {
        authAPI.getCurrentUser()
          .then(res => {
            if (res.success && res.user) {
              setCurrentUser(res.user);
              setPage(res.user.role === 'admin' ? 'admin' : 'dashboard');
              return;
            }
            removeToken();
            setCurrentUser(null);
            setPage('home');
          })
          .catch(() => {
            removeToken();
            setCurrentUser(null);
            setPage('home');
          });
      } else {
        removeToken();
      }
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Route based on role
    if (user.role === 'admin') {
      setPage('admin');
    } else {
      setPage('dashboard');
    }
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setPage('admin');
    } else {
      setPage('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    removeToken();
    setPage('home');
  };

  return (
    <>
      {page === "home" && <HomePage onLogin={() => setPage("login")} onSignup={() => setPage("signup")} />}
      {page === "login" && <LoginPage onLogin={handleLogin} onSignup={() => setPage("signup")} onBack={() => setPage("home")} />}
      {page === "signup" && <SignupPage onSignup={handleSignup} onLogin={() => setPage("login")} onBack={() => setPage("home")} />}
  {page === "dashboard" && <UserDashboard onLogout={handleLogout} user={currentUser} isAdmin={currentUser?.role === 'admin'} onAdminUsers={() => setPage("admin")} />}
  {page === "admin" && <AdminDashboard onLogout={handleLogout} user={currentUser} />}
    </>
  );
}

export default App;