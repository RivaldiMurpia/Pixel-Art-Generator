
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-300 text-sm tracking-widest">GENERATING PIXELS...</p>
    </div>
  );
};

export default Loader;
