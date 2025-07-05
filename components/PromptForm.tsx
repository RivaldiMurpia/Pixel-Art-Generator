
import React from 'react';
import LightbulbIcon from './icons/LightbulbIcon';
import ImageIcon from './icons/ImageIcon';
import FilmIcon from './icons/FilmIcon';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt: string) => void;
  generationMode: 'static' | 'animation';
  setGenerationMode: (mode: 'static' | 'animation') => void;
  animationFrameCount: number;
  setAnimationFrameCount: (count: number) => void;
  onGenerate: () => void;
  onInspire: () => void;
  isLoading: boolean;
  model: string;
  setModel: (model: string) => void;
  isApiKeySet: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ 
  prompt, setPrompt, 
  negativePrompt, setNegativePrompt, 
  generationMode, setGenerationMode, 
  animationFrameCount, setAnimationFrameCount,
  onGenerate, onInspire, isLoading, model, setModel, isApiKeySet
}) => {
  
  const isDisabled = isLoading || !isApiKeySet;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isDisabled) onGenerate();
    }
  };

  const handleFrameCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimationFrameCount(Number(e.target.value));
  };

  const handleFrameCountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      let value = Number(e.target.value);
      if (value < 4) value = 4;
      if (value > 25) value = 25;
      setAnimationFrameCount(value);
  };

  return (
    <div className={`mb-4 p-4 bg-slate-800/50 border-2 border-slate-700 transition-opacity duration-300 ${!isApiKeySet ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <fieldset disabled={isDisabled} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm uppercase text-slate-400">Generation Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGenerationMode('static')}
                className={`flex items-center justify-center gap-2 w-full py-2 px-3 text-sm font-bold border-2 transition-colors duration-200 rounded-sm ${generationMode === 'static' ? 'bg-cyan-500 text-slate-900 border-cyan-700' : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500'}`}
              >
                <ImageIcon /> Static
              </button>
              <button
                onClick={() => setGenerationMode('animation')}
                className={`flex items-center justify-center gap-2 w-full py-2 px-3 text-sm font-bold border-2 transition-colors duration-200 rounded-sm ${generationMode === 'animation' ? 'bg-cyan-500 text-slate-900 border-cyan-700' : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500'}`}
              >
                <FilmIcon /> Animation
              </button>
            </div>
            {generationMode === 'animation' && (
              <div className="mt-4">
                <label htmlFor="frame-count-input" className="block mb-2 text-sm uppercase text-slate-400">Frame Count (4-25)</label>
                <input
                  type="number"
                  id="frame-count-input"
                  value={animationFrameCount}
                  onChange={handleFrameCountChange}
                  onBlur={handleFrameCountBlur}
                  min="4"
                  max="25"
                  className="w-full p-2 bg-slate-900 border-2 border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 text-base rounded-sm disabled:bg-slate-800 disabled:text-slate-500"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm uppercase text-slate-400">Select Model</label>
            <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setModel('imagen-3.0-generate-002')}
                  className={`w-full py-2 px-3 text-sm font-bold border-2 transition-colors duration-200 rounded-sm ${model === 'imagen-3.0-generate-002' ? 'bg-cyan-500 text-slate-900 border-cyan-700' : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500'}`}
                >
                  Imagen 3
                </button>
                <button disabled title="Coming soon!" className="w-full py-2 px-3 text-sm font-bold border-2 bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed rounded-sm">
                  Imagen 4 <span className="text-xs opacity-70">(Soon)</span>
                </button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="prompt-input" className="text-sm uppercase text-slate-400">Your Asset Description</label>
            <button onClick={onInspire} className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 transition-colors disabled:text-slate-500 disabled:cursor-not-allowed" title="Get a random prompt idea">
              <LightbulbIcon /> Inspire Me!
            </button>
          </div>
          <textarea
            id="prompt-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="e.g., a rusty shield, a health potion, a cute robot..."
            className="w-full p-3 bg-slate-900 border-2 border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 resize-none text-base h-24 rounded-sm disabled:bg-slate-800 disabled:text-slate-500"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="negative-prompt-input" className="text-sm uppercase text-slate-400">Negative Prompts (Optional)</label>
          <textarea
            id="negative-prompt-input" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="e.g., blurry, text, watermark, extra limbs..."
            className="w-full mt-2 p-2 bg-slate-900 border-2 border-slate-600 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all duration-200 resize-none text-sm h-16 rounded-sm disabled:bg-slate-800 disabled:text-slate-500"
            rows={2}
          />
        </div>

        <button
          onClick={onGenerate}
          className="w-full py-3 px-6 text-lg uppercase bg-cyan-500 text-slate-900 font-bold border-b-4 border-cyan-700 hover:bg-cyan-400 hover:border-cyan-600 active:border-b-0 active:mt-[4px] transition-all duration-100 disabled:bg-slate-600 disabled:text-slate-400 disabled:border-slate-800 disabled:cursor-not-allowed rounded-sm"
        >
          {isLoading ? 'Generating...' : (isApiKeySet ? 'Generate' : 'Set API Key to Generate')}
        </button>
      </fieldset>
    </div>
  );
};

export default PromptForm;
