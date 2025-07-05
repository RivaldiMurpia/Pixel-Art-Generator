
import React from 'react';
import { Asset, AnimationAsset } from '../types';
import ImageCard from './ImageCard';
import AnimationCard from './AnimationCard';

interface ImageGridProps {
  assets: Asset[];
  selectedImageIds: Set<string>;
  favoriteIds: Set<string>;
  styleLockId: string | null;
  onSelectImage: (id: string) => void;
  onGenerateVariation: (prompt: string) => void;
  onToggleFavorite: (asset: Asset) => void;
  onSetStyleLock: (asset: Asset) => void;
}

// Type guard
const isAnimationAsset = (asset: Asset): asset is AnimationAsset => 'frames' in asset;

const ImageGrid: React.FC<ImageGridProps> = ({ 
  assets, 
  selectedImageIds, 
  favoriteIds,
  styleLockId,
  onSelectImage, 
  onGenerateVariation,
  onToggleFavorite,
  onSetStyleLock
}) => {
  if (assets.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {assets.map((asset) => (
        isAnimationAsset(asset) ? (
          <AnimationCard
            key={asset.id}
            asset={asset}
            isSelected={selectedImageIds.has(asset.id)}
            isFavorite={favoriteIds.has(asset.id)}
            isStyleLocked={styleLockId === asset.id}
            onSelect={() => onSelectImage(asset.id)}
            onGenerateVariation={() => onGenerateVariation(asset.prompt)}
            onToggleFavorite={() => onToggleFavorite(asset)}
            onSetStyleLock={() => onSetStyleLock(asset)}
          />
        ) : (
          <ImageCard 
            key={asset.id} 
            image={asset}
            isSelected={selectedImageIds.has(asset.id)}
            isFavorite={favoriteIds.has(asset.id)}
            isStyleLocked={styleLockId === asset.id}
            onSelect={() => onSelectImage(asset.id)}
            onGenerateVariation={() => onGenerateVariation(asset.prompt)}
            onToggleFavorite={() => onToggleFavorite(asset)}
            onSetStyleLock={() => onSetStyleLock(asset)}
          />
        )
      ))}
    </div>
  );
};

export default ImageGrid;
