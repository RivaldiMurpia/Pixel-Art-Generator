import React from 'react';

const LightbulbIcon: React.FC = () => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="w-4 h-4"
    >
        <path d="M15.09 16.05A6.49 6.49 0 0 1 9 17.5a6.5 6.5 0 0 1-4.09-11.95A6.5 6.5 0 0 1 15.91 4.1 6.5 6.5 0 0 1 15.09 16.05Z"></path>
        <path d="M9 17.5V22"></path><path d="M12 22h-6"></path>
        <path d="M8.5 11.5 7 13l3.5 3.5 3.5-3.5-1.5-1.5"></path>
    </svg>
  );
};

export default LightbulbIcon;