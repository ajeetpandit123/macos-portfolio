import React from 'react';
import { motion } from 'framer-motion';

const Window = ({ title, children, onClose, onMinimize, onExpand }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="mac-window w-full max-w-4xl max-h-[80vh] flex flex-col"
    >
      <div className="h-10 flex items-center px-4 bg-white/5 border-b border-white/10 shrink-0">
        <div className="flex gap-2 w-20">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-mac-red hover:bg-mac-red/80 transition-colors" />
          <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-mac-yellow hover:bg-mac-yellow/80 transition-colors" />
          <button onClick={onExpand} className="w-3 h-3 rounded-full bg-mac-green hover:bg-mac-green/80 transition-colors" />
        </div>
        <div className="flex-1 text-center text-sm font-medium text-white/50">
          {title}
        </div>
        <div className="w-20" />
      </div>
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
