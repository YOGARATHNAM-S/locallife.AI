
import React from 'react';

export const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 bg-indigo-600/10 blur-xl rounded-full scale-150 opacity-40 animate-pulse"></div>
      
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        className="w-full h-full relative z-10 drop-shadow-sm" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <filter id="outerGlow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Shield/Pin Hybrid Shape */}
        <path 
          d="M50 8C29.5 8 13 24.5 13 45C13 72.5 50 92 50 92C50 92 87 72.5 87 45C87 24.5 70.5 8 50 8ZM50 62C40.6 62 33 54.4 33 45C33 35.6 40.6 28 50 28C59.4 28 67 35.6 67 45C67 54.4 59.4 62 50 62Z" 
          fill="url(#primaryGradient)"
          filter="url(#outerGlow)"
        />
        
        {/* Core Intelligence Hub */}
        <circle cx="50" cy="45" r="8" fill="white" className="animate-pulse" />
        
        {/* Data Sync Arcs */}
        <path 
          d="M38 45C38 38.3726 43.3726 33 50 33C56.6274 33 62 38.3726 62 45" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round" 
          className="opacity-40"
        />
      </svg>
    </div>
  );
};
