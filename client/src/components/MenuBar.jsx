import React, { useState, useEffect } from 'react';
import { Apple, Wifi, Battery, Search, Command } from 'lucide-react';

const MenuBar = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 text-xs font-medium text-white/90 z-[100]">
      <div className="flex items-center gap-4">
        <Apple size={14} className="cursor-pointer hover:opacity-70" />
        <span className="font-bold cursor-pointer">File</span>
        <span className="cursor-pointer">Edit</span>
        <span className="cursor-pointer">View</span>
        <span className="cursor-pointer">Go</span>
        <span className="cursor-pointer">Window</span>
        <span className="cursor-pointer">Help</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Wifi size={14} className="cursor-pointer" />
        <Battery size={14} className="cursor-pointer" />
        <Search size={14} className="cursor-pointer" />
        <span className="cursor-pointer">{formatDate(date)}</span>
        <span className="cursor-pointer">{formatTime(date)}</span>
      </div>
    </div>
  );
};

export default MenuBar;
