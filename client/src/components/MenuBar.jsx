import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, Volume2, Search } from 'lucide-react';

const MenuBar = ({ onTabChange, onDownloadResume, profile, isLoggedIn, activeTab }) => {
  const [date, setDate] = useState(new Date());
  const [openMenu, setOpenMenu] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [zoom, setZoom] = useState(100);
  const menuRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleAction = (action) => {
    setOpenMenu(null);
    switch (action) {
      case 'download-resume':
        if (profile?.resumeUrl) window.open(profile.resumeUrl, '_blank');
        else alert('No resume uploaded yet.');
        break;
      case 'download-portfolio':
        window.print();
        break;
      case 'export-projects':
        fetch('/api/projects').then(r => r.json()).then(data => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'projects.json'; a.click();
        }).catch(() => alert('Could not export projects.'));
        break;
      case 'print':
        window.print();
        break;
      case 'copy-email':
        navigator.clipboard.writeText('kumarajeet19022004@gmail.com');
        alert('Email copied to clipboard!');
        break;
      case 'copy-link':
        navigator.clipboard.writeText(window.location.href);
        alert('Portfolio link copied!');
        break;
      case 'toggle-dark':
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('light-mode');
        break;
      case 'zoom-in':
        setZoom(z => { const nz = Math.min(z + 10, 150); document.body.style.zoom = nz + '%'; return nz; });
        break;
      case 'zoom-out':
        setZoom(z => { const nz = Math.max(z - 10, 70); document.body.style.zoom = nz + '%'; return nz; });
        break;
      case 'zoom-reset':
        setZoom(100); document.body.style.zoom = '100%';
        break;
      case 'fullscreen':
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
        break;
      case 'nav-home': onTabChange('home'); break;
      case 'nav-about': onTabChange('about'); break;
      case 'nav-projects': onTabChange('projects'); break;
      case 'nav-skills': onTabChange('skills'); break;
      case 'nav-contact': onTabChange('contact'); break;
      case 'nav-admin': onTabChange('admin'); break;
      case 'nav-preview': onTabChange('preview'); break;
      case 'nav-profile': onTabChange('profile'); break;
      case 'logout':
        localStorage.removeItem('token');
        window.location.reload();
        break;
      case 'minimize': document.dispatchEvent(new CustomEvent('mac-minimize')); break;
      case 'maximize': document.dispatchEvent(new CustomEvent('mac-maximize')); break;
      case 'reset-zoom': setZoom(100); document.body.style.zoom = '100%'; break;
      default: break;
    }
  };

  const menus = {
    apple: [
      { label: '  About This Portfolio', action: 'nav-about' },
      { divider: true },
      { label: '👤  Profile Settings', action: 'nav-profile' },
      { label: '⚙️  System Preferences...', action: 'nav-admin' },
      { divider: true },
      { label: '🔒  Lock Screen', action: 'logout', shortcut: '⌃⌘Q' },
      { label: 'Log Out...', action: 'logout', shortcut: '⇧⌘Q' },
    ],
    File: [
      { label: '⬇️  Download Resume (PDF)', action: 'download-resume' },
      { label: '🖨️  Print Portfolio', action: 'print' },
      { divider: true },
      { label: '📦  Export Projects (JSON)', action: 'export-projects' },
    ],
    Edit: [
      { label: '📧  Copy Email Address', action: 'copy-email' },
      { label: '🔗  Copy Portfolio Link', action: 'copy-link' },
    ],
    View: [
      { label: `${isDarkMode ? '☀️' : '🌙'}  Toggle ${isDarkMode ? 'Light' : 'Dark'} Mode`, action: 'toggle-dark' },
      { divider: true },
      { label: '🔍  Zoom In', action: 'zoom-in', shortcut: '⌘+' },
      { label: '🔎  Zoom Out', action: 'zoom-out', shortcut: '⌘-' },
      { label: `↩️  Reset Zoom (${zoom}%)`, action: 'zoom-reset' },
      { divider: true },
      { label: '⛶  Toggle Fullscreen', action: 'fullscreen', shortcut: '⌃⌘F' },
    ],
    Go: [
      { label: '🏠  Home', action: 'nav-home' },
      { label: '👤  About', action: 'nav-about' },
      { label: '💼  Projects', action: 'nav-projects' },
      { label: '⚡  Skills', action: 'nav-skills' },
      { label: '📬  Contact', action: 'nav-contact' },
      { label: '📄  Resume Preview', action: 'nav-preview' },
      { divider: true },
      ...(isLoggedIn ? [{ label: '🔒  Admin Panel', action: 'nav-admin' }] : []),
    ],
    Window: [
      { label: '▲  Minimize Window', action: 'minimize' },
      { label: '⛶  Maximize Window', action: 'maximize' },
    ],
    Help: [
      { label: '📌  Built with MERN Stack', action: null },
      { label: '💡  Powered by React + Vite', action: null },
    ],
  };

  return (
    <div
      ref={menuRef}
      className="fixed top-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-6 text-base font-semibold text-white z-[200] select-none shadow-lg border-b border-white/5"
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          className={`px-2 py-1 rounded transition-colors flex items-center ${activeTab === 'profile' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          onClick={() => onTabChange('profile')}
        >
          {profile?.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-mac-green flex items-center justify-center text-black text-sm font-bold border-2 border-white/30 shadow-md">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
        </button>

        {Object.keys(menus).filter(m => m !== 'apple').map((menuName) => (
          <div key={menuName} className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === menuName ? null : menuName)}
              className={`px-4 py-2 rounded-lg transition-colors ${openMenu === menuName ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              {menuName}
            </button>

            {openMenu === menuName && (
              <div
                className="absolute top-full left-0 mt-1 w-56 bg-[#1c1c1e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1 overflow-hidden"
                style={{ zIndex: 300 }}
              >
                {menus[menuName].map((item, i) =>
                  item.divider ? (
                    <div key={i} className="border-t border-white/10 my-1" />
                  ) : (
                    <button
                      key={i}
                      disabled={!item.action}
                      onClick={() => item.action && handleAction(item.action)}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between transition-colors ${item.action
                          ? 'hover:bg-[#0070c9] hover:text-white text-white/80 cursor-pointer'
                          : 'text-white/30 cursor-default'
                        }`}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && <span className="text-white/30 text-[10px]">{item.shortcut}</span>}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}

        {/* Apple Menu (Special) */}
        {openMenu === 'apple' && (
          <div className="relative">
            <div
              className="absolute top-12 left-0 w-64 bg-[#1c1c1e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1 overflow-hidden"
              style={{ zIndex: 300 }}
            >
              {menus.apple.map((item, i) =>
                item.divider ? (
                  <div key={i} className="border-t border-white/10 my-1" />
                ) : (
                  <button
                    key={i}
                    disabled={!item.action}
                    onClick={() => item.action && handleAction(item.action)}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between transition-colors ${item.action
                        ? 'hover:bg-[#0070c9] hover:text-white text-white/80 cursor-pointer'
                        : 'text-white/30 cursor-default'
                      }`}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && <span className="text-white/30 text-[10px]">{item.shortcut}</span>}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5 text-white/80">
        <Volume2 size={18} className="cursor-pointer hover:text-white transition-colors" />
        <Wifi size={18} className="cursor-pointer hover:text-white transition-colors" />
        <Battery size={18} className="cursor-pointer hover:text-white transition-colors" />
        <Search
          size={18}
          className="cursor-pointer hover:text-white transition-colors"
          onClick={() => onTabChange && onTabChange('home')}
        />
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[11px] text-white/50 font-bold uppercase tracking-tighter">{formatDate(date)}</span>
          <span className="text-sm text-white font-bold">{formatTime(date)}</span>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
