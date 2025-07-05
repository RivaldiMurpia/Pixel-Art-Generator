
import React from 'react';

interface StarIconProps {
  isFilled: boolean;
}

const StarIcon: React.FC<StarIconProps> = ({ isFilled }) => {
  const fillClass = isFilled ? "fill-current text-yellow-400" : "fill-none";
  const color = isFilled ? "text-yellow-400" : "text-slate-300";

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={`w-5 h-5 transition-colors ${color} hover:text-yellow-300 ${fillClass}`}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
};

export default StarIcon;
