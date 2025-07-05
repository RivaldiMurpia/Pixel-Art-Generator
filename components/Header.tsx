
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400 tracking-wider">
        Pixel Art Generator
      </h1>
      <p className="text-sm text-slate-400 mt-2">Create game assets with AI</p>
    </header>
  );
};

export default Header;
