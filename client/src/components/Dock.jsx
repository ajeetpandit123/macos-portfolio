import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Briefcase, Code, Mail, LayoutDashboard } from 'lucide-react';

const DOCK_ITEMS = [
  { id: 'home',     icon: Home,            label: 'Home'    },
  { id: 'about',    icon: User,            label: 'About'   },
  { id: 'skills',   icon: Code,            label: 'Skills'  },
  { id: 'projects', icon: Briefcase,       label: 'Projects'},
  { id: 'contact',  icon: Mail,            label: 'Contact' },
  { id: 'admin',    icon: LayoutDashboard, label: 'Admin'   },
];

const Dock = ({ activeTab, onTabChange }) => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const hideTimer = useRef(null);

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current + 10) {
        // Scrolling down
        setVisible(false);
      } else if (currentY < lastScrollY.current - 5) {
        // Scrolling up
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show dock briefly when mouse is near the bottom of the screen
  useEffect(() => {
    const handleMouseMove = (e) => {
      const threshold = window.innerHeight - 80;
      if (e.clientY > threshold) {
        setVisible(true);
        clearTimeout(hideTimer.current);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="mac-dock"
          style={{ zIndex: 100 }}
        >
          {DOCK_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.div
                key={item.id}
                className={`dock-item group relative ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(item.id)}
                whileHover={{ scale: 1.28, translateY: -10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {/* Icon background highlight for active */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-white/10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <item.icon
                  size={24}
                  className={`relative z-10 transition-colors duration-200 ${
                    isActive ? 'text-[#27c93f]' : 'text-white/70 group-hover:text-white'
                  }`}
                />

                {/* Tooltip */}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/70 backdrop-blur-md rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                  {item.label}
                </span>

                {/* Active dot */}
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dock;
