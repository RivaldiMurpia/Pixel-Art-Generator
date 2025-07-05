
import React from 'react';

interface ViewToggleProps {
  currentView: 'history' | 'favorites';
  setCurrentView: (view: 'history' | 'favorites') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, setCurrentView }) => {
  const baseClasses = "w-full py-2 px-3 text-sm font-bold border-2 transition-colors duration-200 rounded-sm uppercase";
  const activeClasses = "bg-violet-500 text-slate-900 border-violet-700";
  const inactiveClasses = "bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500";
  
  return (
    <div className="my-8">
      <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
          <button
            onClick={() => setCurrentView('history')}
            className={`${baseClasses} ${currentView === 'history' ? activeClasses : inactiveClasses}`}
          >
            History
          </button>
          <button
            onClick={() => setCurrentView('favorites')}
            className={`${baseClasses} ${currentView === 'favorites' ? activeClasses : inactiveClasses}`}
          >
            Favorites
          </button>
        </div>
    </div>
  );
};

export default ViewToggle;
