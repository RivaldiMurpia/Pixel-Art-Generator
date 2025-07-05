
import React from 'react';
import { Asset } from '../types';

interface StyleLockPreviewProps {
  asset: Asset;
  onClear: () => void;
}

const StyleLockPreview: React.FC<StyleLockPreviewProps> = ({ asset, onClear }) => {
  const thumbnail = 'frames' in asset ? asset.frames[0] : asset.base64;

  return (
    <div className="mb-4 p-2 bg-amber-900/50 border-2 border-amber-700 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img src={thumbnail} alt="Style lock preview" className="w-10 h-10 pixelated-rendering bg-slate-700" />
        <div className="text-sm">
          <p className="text-amber-300 font-bold uppercase">Style Locked</p>
          <p className="text-xs text-slate-400 truncate max-w-xs">Using style from: "{asset.prompt}"</p>
        </div>
      </div>
      <button 
        onClick={onClear} 
        className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-3 border border-slate-600 rounded-sm transition-colors"
        title="Unlock style"
      >
        Clear
      </button>
    </div>
  );
};

export default StyleLockPreview;
