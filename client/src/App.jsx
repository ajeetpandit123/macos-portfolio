import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Desktop from './components/Desktop';
import axios from 'axios';

// Set base URL for axios
axios.defaults.baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/';

function App() {
  // Restore last active tab from localStorage, default to 'home'
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'home';
  });
  const [isBooting, setIsBooting] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Persist active tab whenever it changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab) localStorage.setItem('activeTab', tab);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const timer = setTimeout(() => setIsBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);



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
    <div className="h-screen w-screen relative">
      <Toaster position="top-right" />
      <Desktop 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
    </div>
  );
}

export default App;
