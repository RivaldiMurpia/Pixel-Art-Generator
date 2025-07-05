
import React from 'react';
import { ImageAsset } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import SparkleIcon from './icons/SparkleIcon';
import StarIcon from './icons/StarIcon';
import LockIcon from './icons/LockIcon';

interface ImageCardProps {
  image: ImageAsset;
  isSelected: boolean;
  isFavorite: boolean;
  isStyleLocked: boolean;
  onSelect: () => void;
  onGenerateVariation: () => void;
  onToggleFavorite: () => void;
  onSetStyleLock: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, isSelected, isFavorite, isStyleLocked, onSelect, onGenerateVariation, onToggleFavorite, onSetStyleLock }) => {
  
  const handleDownload = () => {
    const img = new Image();
    img.onload = () => {
        const scale = 4;
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const upscaledDataUrl = canvas.toDataURL('image/png');
            
            const link = document.createElement('a');
            link.href = upscaledDataUrl;
            const filename = image.prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
            link.download = `pixel-asset-4x-${filename}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    img.src = image.base64;
  };
  
  const cardBorderColor = isStyleLocked ? 'border-amber-400' : 'border-slate-700 group-hover:border-violet-500';

  return (
    <div className={`group relative bg-slate-800 border-2 ${cardBorderColor} p-1 transition-all duration-300 hover:scale-105`}>
       <div className="absolute top-2 left-2 z-20 flex flex-col gap-2">
          <label className="custom-checkbox" onClick={(e) => e.stopPropagation()} title="Select for spritesheet">
            <input type="checkbox" checked={isSelected} onChange={onSelect} />
            <span className="checkmark"></span>
          </label>
        </div>

        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2 opacity-80 group-hover:opacity-100">
            <button onClick={onToggleFavorite} title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                <StarIcon isFilled={isFavorite} />
            </button>
            <button onClick={onSetStyleLock} title={isStyleLocked ? 'Style is locked' : 'Lock style'}>
                <LockIcon isLocked={isStyleLocked} />
            </button>
        </div>

      <div className="relative aspect-square bg-grid-pattern bg-slate-700">
        <img
          src={image.base64}
          alt={image.prompt}
          className="w-full h-full object-contain pixelated-rendering"
        />
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-2">
          <button
            onClick={onGenerateVariation}
            className="flex items-center gap-1 bg-fuchsia-600 text-white py-2 px-3 text-xs border-b-2 border-fuchsia-800 hover:bg-fuchsia-500 active:border-b-0 active:translate-y-[1px] transition-all"
            title="Generate variations"
          >
            <SparkleIcon />
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 bg-violet-600 text-white py-2 px-3 text-xs border-b-2 border-violet-800 hover:bg-violet-500 active:border-b-0 active:translate-y-[1px] transition-all"
            title="Download 4x Upscaled"
          >
            <DownloadIcon />
          </button>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 truncate p-1">{image.prompt}</p>
    </div>
  );
};

export default ImageCard;
