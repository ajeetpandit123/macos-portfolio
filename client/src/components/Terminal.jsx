import React from 'react';

const Terminal = () => {
  return (
    <div className="flex flex-col h-full font-mono text-[13px] leading-relaxed text-white/90">
      <div className="mb-4 text-white/50">
        Last login: {new Date().toDateString()} 12:40:12 on ttys001
      </div>
      <div className="mb-4">
        <span className="text-orange-400">sacha@macbook</span> <span className="text-white/50">~ %</span> <span className="text-blue-400">help</span>
      </div>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-6">
        <div className="flex gap-4">
          <span className="text-blue-400 w-20">about</span>
          <span className="text-white/70">- Read bio</span>
        </div>
        <div className="flex gap-4">
          <span className="text-blue-400 w-20">stack</span>
          <span className="text-white/70">- Tech preferences</span>
        </div>
        <div className="flex gap-4">
          <span className="text-blue-400 w-20">projects</span>
          <span className="text-white/70">- View work</span>
        </div>
        <div className="flex gap-4">
          <span className="text-blue-400 w-20">contact</span>
          <span className="text-white/70">- Get in touch</span>
        </div>
        <div className="flex gap-4">
          <span className="text-blue-400 w-20">clear</span>
          <span className="text-white/70">- Clear terminal</span>
        </div>
        <div className="flex gap-4">
          <span className="text-blue-400 w-20">resume</span>
          <span className="text-white/70">- Download PDF</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-orange-400">sacha@macbook</span> <span className="text-white/50">~ %</span>
        <span className="w-2 h-4 bg-white/50 animate-pulse" />
      </div>
    </div>
  );
};

export default Terminal;
