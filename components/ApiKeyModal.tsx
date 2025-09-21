import React, { useState } from 'react';
import { Spinner } from './Spinner';

interface ApiKeyModalProps {
  onKeySubmit: (key: string) => Promise<boolean>;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('API Key cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    const isValid = await onKeySubmit(apiKey);
    if (!isValid) {
      setError('Invalid API Key. Please check the key and try again.');
    }
    // On success, the parent component will re-render and this modal will be unmounted.
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex items-center justify-center z-50 font-sans">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4">
        <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-700">Enter Your Gemini API Key</h2>
        </div>
        <p className="text-slate-500 mb-6">To use this application, please provide your Google Gemini API key. Your key will be stored securely in your browser's local storage and will not be shared.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-slate-600 mb-1">
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key here"
              className="w-full p-3 bg-[#E2EAF4] border border-slate-300 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              aria-describedby="error-message"
            />
          </div>
          {error && (
            <p id="error-message" className="text-red-600 text-sm mb-4" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? <><Spinner /> <span className="ml-2">Verifying...</span></> : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};