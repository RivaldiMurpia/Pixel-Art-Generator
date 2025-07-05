import React from 'react';

const SpritesheetIcon: React.FC = () => {
  return (
    <svg 
        xmlns="http://www.w.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="w-5 h-5"
    >
        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
        <path d="M3 9h18"></path>
        <path d="M9 3v18"></path>
    </svg>
  );
};

export default SpritesheetIcon;