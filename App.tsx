
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Asset, ImageAsset, AnimationAsset } from './types';
import { generateStaticImages, generateAnimationFrames } from './services/geminiService';
import Header from './components/Header';
import ApiKeyForm from './components/ApiKeyForm';
import PromptForm from './components/PromptForm';
import ImageGrid from './components/ImageGrid';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import SpritesheetExporter from './components/SpritesheetExporter';
import StyleLockPreview from './components/StyleLockPreview';
import ViewToggle from './components/ViewToggle';

const MAX_HISTORY_SIZE = 8;

const promptIdeas = [
  "a glowing magic sword", "a chest full of gold", "a cute slime monster",
  "an ancient spellbook", "a steampunk robot", "a healing potion",
  "a mysterious floating crystal", "a rustic wooden shield", "a goblin thief",
  "a dragon's egg", "a sci-fi laser pistol", "a treasure map", "a hero walking",
  "a coin spinning", "an explosion effect", "a flag waving"
];

// Type guard to check if an asset is an animation
const isAnimationAsset = (asset: Asset): asset is AnimationAsset => 'frames' in asset;

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('a cute slime monster');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [model, setModel] = useState<string>('imagen-3.0-generate-002');
  const [generationMode, setGenerationMode] = useState<'static' | 'animation'>('static');
  const [animationFrameCount, setAnimationFrameCount] = useState<number>(4);
  
  const [history, setHistory] = useState<Asset[]>([]);
  const [favorites, setFavorites] = useState<Asset[]>([]);
  const [styleLockAsset, setStyleLockAsset] = useState<Asset | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<'history' | 'favorites'>('history');

  // Load state from localStorage on initial render (API Key is intentionally not loaded)
  useEffect(() => {
    const loadFromStorage = (key: string, setter: (data: any) => void) => {
      try {
        const savedData = localStorage.getItem(key);
        if (savedData) setter(JSON.parse(savedData));
      } catch (e) {
        console.error(`Failed to load ${key} from localStorage`, e);
        localStorage.removeItem(key);
      }
    };

    loadFromStorage('pixel-art-history', setHistory);
    loadFromStorage('pixel-art-favorites', setFavorites);
    loadFromStorage('pixel-art-style-lock', setStyleLockAsset);
  }, []);

  const handleSaveApiKey = useCallback((newKey: string) => {
    setApiKey(newKey);
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
        localStorage.setItem('pixel-art-history', JSON.stringify(history.slice(0, MAX_HISTORY_SIZE)));
    } catch (e) { console.error("Failed to save history", e); }
  }, [history]);

  useEffect(() => {
    try {
        localStorage.setItem('pixel-art-favorites', JSON.stringify(favorites));
    } catch (e) { console.error("Failed to save favorites", e); }
  }, [favorites]);

  useEffect(() => {
    try {
        localStorage.setItem('pixel-art-style-lock', JSON.stringify(styleLockAsset));
    } catch (e) { console.error("Failed to save style lock", e); }
  }, [styleLockAsset]);


  const handleGenerate = useCallback(async (promptToUse: string) => {
    if (!apiKey) {
      setError('Please set your Google API Key first.');
      return;
    }
    if (!promptToUse.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const baseConfig = { 
          apiKey,
          prompt: promptToUse, 
          model,
          negativePrompt,
          styleLockPrompt: styleLockAsset?.prompt 
      };

      if (generationMode === 'static') {
        const generatedImages = await generateStaticImages(baseConfig);
        setHistory(prev => [ ...generatedImages, ...prev].slice(0, MAX_HISTORY_SIZE));
      } else {
        const animationConfig = { ...baseConfig, frameCount: animationFrameCount };
        const generatedAnimation = await generateAnimationFrames(animationConfig);
        setHistory(prev => [generatedAnimation, ...prev].slice(0, MAX_HISTORY_SIZE));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, model, negativePrompt, styleLockAsset, generationMode, animationFrameCount]);

  const handleClearHistory = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your generation history? This will not affect your favorites.")) {
      setHistory([]);
      setSelectedImageIds(new Set());
    }
  }, []);
  
  const handleInspireMe = useCallback(() => {
    setPrompt(promptIdeas[Math.floor(Math.random() * promptIdeas.length)]);
  }, []);

  const handleGenerateVariation = useCallback((basePrompt: string) => {
    setPrompt(basePrompt);
    handleGenerate(basePrompt);
  }, [handleGenerate]);

  const toggleImageSelection = useCallback((id: string) => {
    setSelectedImageIds(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) newSelected.delete(id);
      else newSelected.add(id);
      return newSelected;
    });
  }, []);

  const handleClearSelection = useCallback(() => setSelectedImageIds(new Set()), []);
  
  const handleToggleFavorite = useCallback((asset: Asset) => {
    setFavorites(prev => {
        const isFavorited = prev.some(fav => fav.id === asset.id);
        return isFavorited ? prev.filter(fav => fav.id !== asset.id) : [asset, ...prev];
    });
  }, []);

  const handleSetStyleLock = useCallback((asset: Asset) => {
    setStyleLockAsset(asset);
  }, []);

  const handleExportSpritesheet = useCallback(async () => {
    const allAssets = [...history, ...favorites];
    const imagesToExport = allAssets
      .filter(asset => selectedImageIds.has(asset.id) && !isAnimationAsset(asset))
      .map(asset => (asset as ImageAsset));

    if (imagesToExport.length === 0) return;

    try {
        const imageElements = await Promise.all(
            imagesToExport.map(asset => 
                new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = asset.base64;
                })
            )
        );

        if (imageElements.length === 0) return;

        const { width: imgWidth, height: imgHeight } = imageElements[0];
        const canvas = document.createElement('canvas');
        canvas.width = imageElements.length * imgWidth;
        canvas.height = imgHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not create canvas context");
        
        ctx.imageSmoothingEnabled = false;
        imageElements.forEach((img, index) => ctx.drawImage(img, index * imgWidth, 0));

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `spritesheet-${Date.now()}.png`;
        link.click();
        handleClearSelection();
    } catch (e) {
        setError("An error occurred while creating the spritesheet.");
    }
}, [selectedImageIds, history, favorites, handleClearSelection]);

  const assetsToDisplay = currentView === 'history' ? history : favorites;
  const favoriteIds = useMemo(() => new Set(favorites.map(f => f.id)), [favorites]);
  const isApiKeySet = !!apiKey;

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 ${selectedImageIds.size > 0 ? 'pb-24' : ''}`}>
      <div className="container mx-auto max-w-6xl">
        <Header />
        <main>
          <ApiKeyForm
            apiKey={apiKey}
            onSaveKey={handleSaveApiKey}
          />

          {styleLockAsset && <StyleLockPreview asset={styleLockAsset} onClear={() => setStyleLockAsset(null)} />}
          <PromptForm 
            prompt={prompt} 
            setPrompt={setPrompt} 
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            generationMode={generationMode}
            setGenerationMode={setGenerationMode}
            animationFrameCount={animationFrameCount}
            setAnimationFrameCount={setAnimationFrameCount}
            onGenerate={() => handleGenerate(prompt)}
            onInspire={handleInspireMe}
            isLoading={isLoading}
            model={model}
            setModel={setModel}
            isApiKeySet={isApiKeySet}
          />
          
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}

          <ViewToggle currentView={currentView} setCurrentView={setCurrentView} />

          {assetsToDisplay.length === 0 && !isLoading && !error && (
             <div className="text-center py-16 text-slate-500">
                <p className="text-lg">{currentView === 'history' ? 'Your generated assets will appear here.' : 'Your favorite assets will appear here.'}</p>
                <p className="text-sm mt-2">{currentView === 'history' ? 'Try generating something new!' : 'Mark an asset as a favorite to see it here.'}</p>
             </div>
          )}
          
          {assetsToDisplay.length > 0 && (
            <div className="mt-6">
               <div className="flex justify-between items-center mb-4 border-b-2 border-slate-700 pb-2">
                 <h2 className="text-2xl text-slate-300 capitalize">{currentView}</h2>
                 {currentView === 'history' && (
                  <button onClick={handleClearHistory} className="text-xs bg-red-800/70 hover:bg-red-700 text-red-200 py-1 px-3 border border-red-600 rounded-sm transition-colors">
                      Clear History
                  </button>
                 )}
              </div>
              <ImageGrid 
                assets={assetsToDisplay}
                selectedImageIds={selectedImageIds}
                favoriteIds={favoriteIds}
                styleLockId={styleLockAsset?.id || null}
                onSelectImage={toggleImageSelection}
                onGenerateVariation={handleGenerateVariation}
                onToggleFavorite={handleToggleFavorite}
                onSetStyleLock={handleSetStyleLock}
              />
            </div>
          )}
        </main>
        <footer className="text-center mt-12 text-slate-600 text-xs">
          <p>Powered by Google Imagen & Gemini</p>
        </footer>
      </div>
       <SpritesheetExporter 
        selectedCount={selectedImageIds.size}
        onExport={handleExportSpritesheet}
        onClear={handleClearSelection}
      />
    </div>
  );
};

export default App;
