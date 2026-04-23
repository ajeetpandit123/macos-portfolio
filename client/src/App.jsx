import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Desktop from './components/Desktop';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import axios from 'axios';

// Set base URL for axios
axios.defaults.baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5010/api') + '/';

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const timer = setTimeout(() => setIsBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
  };

  if (isBooting) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" 
          alt="Apple Logo" 
          className="w-24 h-24 mb-12 invert"
        />
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-progress" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="h-screen w-screen relative">
        <Toaster position="top-right" />
        <Routes>
          {/* Public Portfolio Route */}
          <Route path="/" element={
            <Desktop 
              isLoggedIn={isLoggedIn} 
              setIsLoggedIn={setIsLoggedIn} 
              defaultTab="home"
            />
          } />

          {/* Admin Login Route */}
          <Route path="/admin" element={
            isLoggedIn ? <Navigate to="/admin/dashboard" replace /> : 
            <div className="h-screen w-screen bg-[#1e1e1e] flex items-center justify-center p-4">
               <Login onLogin={handleLoginSuccess} />
            </div>
          } />

          {/* Protected Admin Dashboard Route */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Desktop 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} 
                defaultTab="admin"
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          } />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
