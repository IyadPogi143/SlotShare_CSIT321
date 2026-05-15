import React, { useState, useEffect } from 'react';
import './styles.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { getUserFromToken, removeToken } from './services/api';

function App() {
  const [page, setPage] = useState("home"); // home | login | signup | dashboard | admin
  const [currentUser, setCurrentUser] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = getUserFromToken();
      if (user) {
        setCurrentUser(user);
        setPage(user.role === 'admin' ? 'admin' : 'dashboard');
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
      {page === "dashboard" && <UserDashboard onLogout={handleLogout} user={currentUser} />}
      {page === "admin" && <AdminDashboard onLogout={handleLogout} user={currentUser} />}
    </>
  );
}

export default App;