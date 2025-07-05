import React from 'react';
import SpritesheetIcon from './icons/SpritesheetIcon';

interface SpritesheetExporterProps {
  selectedCount: number;
  onExport: () => void;
  onClear: () => void;
}

const SpritesheetExporter: React.FC<SpritesheetExporterProps> = ({ selectedCount, onExport, onClear }) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm border-t-2 border-violet-500 z-50 transform-gpu transition-transform duration-300 ease-out">
        <div className="container mx-auto max-w-6xl p-3 flex justify-between items-center">
            <p className="text-sm text-slate-300">
                <span className="font-bold text-lg text-white">{selectedCount}</span> image{selectedCount > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-2">
                <button 
                    onClick={onClear} 
                    className="text-xs text-slate-400 hover:text-white transition-colors py-2 px-3"
                >
                    Clear
                </button>
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 bg-violet-600 text-white py-2 px-4 border-b-2 border-violet-800 hover:bg-violet-500 active:border-b-0 active:translate-y-[1px] transition-all text-sm rounded-sm"
                >
                    <SpritesheetIcon />
                    Export Spritesheet
                </button>
            </div>
        </div>
    </div>
  );
};

export default SpritesheetExporter;