
import React, { useState, useEffect } from 'react';
import { AnimationAsset } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import SparkleIcon from './icons/SparkleIcon';
import StarIcon from './icons/StarIcon';
import LockIcon from './icons/LockIcon';

interface AnimationCardProps {
  asset: AnimationAsset;
  isSelected: boolean;
  isFavorite: boolean;
  isStyleLocked: boolean;
  onSelect: () => void;
  onGenerateVariation: () => void;
  onToggleFavorite: () => void;
  onSetStyleLock: () => void;
}

const AnimationCard: React.FC<AnimationCardProps> = ({ asset, isSelected, isFavorite, isStyleLocked, onSelect, onGenerateVariation, onToggleFavorite, onSetStyleLock }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering || asset.frames.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % asset.frames.length);
    }, 150); // Animation speed

    return () => clearInterval(interval);
  }, [isHovering, asset.frames.length]);

  const handleDownload = async () => {
    try {
        const imageElements = await Promise.all(
            asset.frames.map(frameSrc => 
                new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = frameSrc;
                })
            )
        );

        const { width: imgWidth, height: imgHeight } = imageElements[0];
        const canvas = document.createElement('canvas');
        canvas.width = imageElements.length * imgWidth;
        canvas.height = imgHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not create canvas context");
        
        ctx.imageSmoothingEnabled = false;
        imageElements.forEach((img, index) => {
            ctx.drawImage(img, index * imgWidth, 0);
        });

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        const filename = asset.prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
        link.download = `pixel-anim-${filename}.png`;
        link.click();

    } catch (e) {
        console.error("Failed to export animation spritesheet", e);
    }
  };
  
  const cardBorderColor = isStyleLocked ? 'border-amber-400' : 'border-slate-700 group-hover:border-violet-500';

  return (
    <div 
        className={`group relative bg-slate-800 border-2 ${cardBorderColor} p-1 transition-all duration-300 hover:scale-105`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { setIsHovering(false); setCurrentFrame(0); }}
    >
       <div className="absolute top-2 left-2 z-20 flex flex-col gap-2">
          <label className="custom-checkbox cursor-not-allowed opacity-50" title="Cannot select animations for spritesheet">
            <input type="checkbox" checked={false} disabled />
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
          src={asset.frames[currentFrame]}
          alt={asset.prompt}
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
            title="Download Animation Spritesheet"
          >
            <DownloadIcon />
          </button>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 truncate p-1">{asset.prompt}</p>
    </div>
  );
};

export default AnimationCard;
