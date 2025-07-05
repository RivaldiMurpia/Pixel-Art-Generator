
import React, { useState, useEffect } from 'react';
import KeyIcon from './icons/KeyIcon';

interface ApiKeyFormProps {
  apiKey: string;
  onSaveKey: (key: string) => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ apiKey, onSaveKey }) => {
  const [currentKey, setCurrentKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // If there's no API key set externally, start in editing mode.
    if (!apiKey) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setCurrentKey(apiKey);
    }
  }, [apiKey]);

  const handleSave = () => {
    if (currentKey.trim()) {
      onSaveKey(currentKey.trim());
      setIsEditing(false);
    }
  };

  const handleClear = () => {
    setCurrentKey('');
    onSaveKey('');
    setIsEditing(true);
  };
  
  if (!isEditing) {
      return (
          <div className="mb-6 p-3 bg-slate-800/50 border-2 border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyIcon />
                <span className="text-sm text-green-400">API Key is set</span>
              </div>
              <button onClick={() => setIsEditing(true)} className="text-xs text-slate-400 hover:text-white transition-colors">
                  Change Key
              </button>
          </div>
      )
  }

  return (
    <div className="mb-6 p-4 bg-slate-800/50 border-2 border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <KeyIcon />
        <label htmlFor="api-key-input" className="font-bold text-slate-300">
          Your Google AI Studio API Key
        </label>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Your key is stored only in your browser. Get yours from {' '}
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
          Google AI Studio
        </a>.
      </p>
      <div className="flex items-center gap-2">
        <input
          id="api-key-input"
          type="password"
          value={currentKey}
          onChange={(e) => setCurrentKey(e.target.value)}
          placeholder="Enter your API Key..."
          className="flex-grow p-2 bg-slate-900 border-2 border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200 text-sm rounded-sm"
        />
        {apiKey && (
             <button onClick={handleClear} className="py-2 px-3 bg-slate-600 text-slate-300 hover:bg-slate-500 text-sm rounded-sm transition-colors">
                Clear
             </button>
        )}
        <button
          onClick={handleSave}
          disabled={!currentKey.trim()}
          className="py-2 px-4 bg-cyan-600 text-white hover:bg-cyan-500 text-sm font-bold rounded-sm transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ApiKeyForm;
