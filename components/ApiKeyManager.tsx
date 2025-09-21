import React, { useState } from 'react';

interface ApiKeyManagerProps {
  onKeySubmit: (key: string) => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Enter Your Gemini API Key</h2>
        <p className="text-slate-600 mb-6">
          To use this application, you need to provide your own Google Gemini API key. 
          Your key is stored only in your browser and is never sent to our servers.
        </p>
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 mb-2">
            API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key here"
            className="w-full p-3 bg-slate-100 border border-slate-300 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            required
          />
          
          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Save and Continue
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>
            Don't have a key? Get one from{' '}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Google AI Studio
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};
