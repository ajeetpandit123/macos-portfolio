import React, { useState, useEffect, useCallback } from 'react';
import MenuBar from './MenuBar';
import Dock from './Dock';
import Terminal from './Terminal';
import Projects from '../pages/Projects';
import About from '../pages/About';
import Skills from '../pages/Skills';
import Contact from '../pages/Contact';
import Admin from '../pages/Admin';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, RotateCcw, ChevronLeft, ChevronRight, HardDrive, FileText, Download, X, User } from 'lucide-react';
import axios from 'axios';

const Desktop = ({ activeTab, onTabChange, isLoggedIn, setIsLoggedIn }) => {
  const [profile, setProfile] = useState(null);
  const [resumeBlobUrl, setResumeBlobUrl] = useState(null);

  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Reset states when tab changes
  useEffect(() => {
    setIsMinimized(false);
    if (activeTab !== 'home') {
      setIsMaximized(true);
    } else {
      setIsMaximized(false);
    }
  }, [activeTab]);

  const handleMinimize = () => setIsMinimized(true);
  const handleMaximize = () => setIsMaximized(prev => !prev);
  const handleClose = () => { onTabChange('home'); setIsMaximized(false); setIsMinimized(false); };

  // Listen for custom events from MenuBar
  useEffect(() => {
    const onMinimize = () => handleMinimize();
    const onMaximize = () => handleMaximize();
    document.addEventListener('mac-minimize', onMinimize);
    document.addEventListener('mac-maximize', onMaximize);
    return () => {
      document.removeEventListener('mac-minimize', onMinimize);
      document.removeEventListener('mac-maximize', onMaximize);
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axios.get('profile');
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleResumeClick = async () => {
    if (profile?.resumeUrl) {
      onTabChange('preview');
      if (!resumeBlobUrl) {
        try {
          const response = await fetch(profile.resumeUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          setResumeBlobUrl(url);
        } catch (err) {
          console.error('Preview failed:', err);
        }
      }
    } else {
      alert('Resume not uploaded yet! Please upload it via the Admin panel.');
    }
  };

  const handleDownload = () => {
    // Use direct Cloudinary URL — same as "View Current Resume" in Admin which works perfectly
    if (profile?.resumeUrl) {
      window.open(profile.resumeUrl, '_blank');
    }
  };

  const getComponent = (id) => {
    switch (id) {
      case 'home':    return <Home />;
      case 'about':   return <About />;
      case 'skills':  return <Skills />;
      case 'projects':return <Projects />;
      case 'contact': return <Contact />;
      case 'profile': return <Profile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} onProfileUpdate={fetchProfile} />;
      case 'admin':   return <Admin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} onProfileUpdate={fetchProfile} />;
      case 'preview': 
        const resumeUrl = profile?.resumeUrl;
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5010/api';
        // Use Google Docs Viewer for reliable cross-browser PDF preview
        const googlePreviewUrl = resumeUrl 
          ? `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`
          : null;
        
        return (
          <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
            <div className="flex items-center justify-between p-3 border-b border-white/5">
              <span className="text-xs text-white/50 font-medium">Ajeet_Resume.pdf</span>
              <button 
                onClick={handleDownload} 
                className="flex items-center gap-2 px-3 py-1 bg-mac-green/20 text-mac-green rounded text-[10px] hover:bg-mac-green/30 transition shadow-lg"
              >
                <Download size={12} /> Download PDF
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-[#1a1a1a]">
              {googlePreviewUrl ? (
                <iframe
                  src={googlePreviewUrl}
                  title="Resume Preview"
                  className="w-full h-full border-0"
                  style={{ minHeight: '600px' }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-white/20">
                  <div className="text-sm uppercase tracking-widest">No Resume Uploaded</div>
                  <div className="text-xs">Please upload a resume PDF from the Admin panel.</div>
                </div>
              )}
            </div>
          </div>
        );
      default:        return <Home />;
    }
  }

  const isBrowserStyle = (id) => id === 'projects';
  const getWindowTitle = (id) => {
    if (id === 'projects') return 'portfolio.dev/projects';
    if (id === 'preview') return 'Preview';
    if (id === 'profile') return 'System Settings — Profile';
    return id.charAt(0).toUpperCase() + id.slice(1);
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden select-none">
      <MenuBar onTabChange={onTabChange} profile={profile} isLoggedIn={isLoggedIn} activeTab={activeTab} />

      {/* Desktop Icons */}
      <div className="fixed top-24 right-8 flex flex-col gap-8 z-10">
        <div className="desktop-icon" onClick={() => onTabChange('projects')}>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
            <HardDrive size={28} className="text-white/80" />
          </div>
          <span>Hard Drive</span>
        </div>
        <div className="desktop-icon" onClick={handleResumeClick}>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 relative overflow-hidden">
            <div className="bg-red-500 w-full h-4 absolute top-0 flex items-center justify-center text-[8px] font-bold text-white">PDF</div>
            <FileText size={22} className="mt-2 text-white/50" />
          </div>
          <span>Resume.pdf</span>
        </div>
      </div>

      <AnimatePresence>
        {activeTab === 'home' && (
          <motion.div
            key="home-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none"
          >
            <p className="text-white/20 text-sm tracking-widest uppercase mb-3 font-mono">Welcome back</p>
            <h1 className="text-5xl font-bold text-white/80 mb-2 text-center px-4">
              {profile?.name || 'Ajeet Kumar Pandit'}
            </h1>
            <p className="text-white/40 text-lg uppercase tracking-widest">
              {profile?.role || 'Fullstack Engineer'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeTab !== 'home' && !isMinimized && (
          <motion.div
            key={activeTab}
            drag={!isMaximized}
            dragMomentum={false}
            initial={isMaximized ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={isMaximized ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
            className={`absolute cursor-default mac-window glass-morphism overflow-hidden flex flex-col shadow-2xl z-20 transition-all duration-300 ease-in-out
              ${isMaximized 
                ? 'inset-0 top-20 w-full h-[calc(100vh-80px)] rounded-none border-none z-50' 
                : isBrowserStyle(activeTab) 
                  ? 'right-8 top-24 w-[700px] h-[580px]' 
                  : activeTab === 'preview' 
                    ? 'left-1/2 top-[12%] -translate-x-1/2 w-[600px] h-[80vh]' 
                    : 'left-1/2 top-[10%] -translate-x-1/2 w-[680px] max-h-[85vh]'}`}
          >
            <div className="h-9 flex items-center px-4 bg-white/5 border-b border-white/5 shrink-0">
              <div className="flex gap-1.5">
                <button onClick={handleClose} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all active:scale-90" title="Close" />
                <button onClick={handleMinimize} className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all active:scale-90" title="Minimize" />
                <button onClick={handleMaximize} className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 transition-all active:scale-90" title="Maximize" />
              </div>
              <div className="flex-1 text-center text-[11px] font-medium text-white/35">
                {getWindowTitle(activeTab)}
              </div>
              <div className="w-12" />
            </div>
            <div className={`flex-1 overflow-y-auto custom-scrollbar ${activeTab === 'preview' ? '' : 'p-6 bg-[#0d0d0d]/80'} text-white`}>
              {getComponent(activeTab)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dock activeTab={activeTab} onTabChange={(tab) => {
        if (tab === activeTab && isMinimized) {
          setIsMinimized(false);
        } else {
          onTabChange(tab);
          if (isMinimized) setIsMinimized(false);
        }
      }} />
    </div>
  );
};

export default Desktop;
