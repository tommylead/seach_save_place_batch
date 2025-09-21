import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { searchPlaces, savePlace } from '../services/geminiService';
import { PlaceSuggestion, PlaceDetails, ToastMessage } from '../types';
import { PlaceSuggestionItem } from './PlaceSuggestionItem';
import { Spinner } from './Spinner';
import { Toast } from './Toast';

interface PlaceSearchProps {
  onPlaceSaved: (place: PlaceDetails) => void;
  apiKey: string;
}

export const PlaceSearch: React.FC<PlaceSearchProps> = ({ onPlaceSaved, apiKey }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savingPlaceId, setSavingPlaceId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const debouncedQuery = useDebounce(query, 300);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchPlaces(apiKey, searchQuery);
      setSuggestions(results);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      addToast(errorMessage, 'error');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchSuggestions(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, fetchSuggestions]);

  const handleSave = async (place: PlaceSuggestion) => {
    setSavingPlaceId(place.place_id);
    try {
      const savedDetails = await savePlace(apiKey, place.place_id, place.name);
      onPlaceSaved(savedDetails);
      addToast(`'${place.name}' was saved successfully!`, 'success');
      setSuggestions(prev => prev.filter(s => s.place_id !== place.place_id));
      if (suggestions.length === 1) { // If it was the last suggestion
          setQuery(''); // Clear the input
      }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        addToast(errorMessage, 'error');
    } finally {
      setSavingPlaceId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">Search for a Location</h2>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Nhà thờ Đức Bà"
          className="w-full pl-10 pr-10 p-3 bg-slate-100 border border-slate-300 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        />
        {isLoading && <div className="absolute inset-y-0 right-0 pr-3 flex items-center"><Spinner /></div>}
      </div>

      <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
        {suggestions.map((suggestion) => (
          <PlaceSuggestionItem
            key={suggestion.place_id}
            suggestion={suggestion}
            onSave={() => handleSave(suggestion)}
            isSaving={savingPlaceId === suggestion.place_id}
          />
        ))}
         {!isLoading && debouncedQuery.length >= 3 && suggestions.length === 0 && (
            <div className="text-center text-slate-500 p-4 bg-slate-50 rounded-md">
                No results found for "{debouncedQuery}".
            </div>
        )}
      </div>
      <div className="fixed top-5 right-5 z-50 space-y-2">
        {toasts.map(toast => (
            <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </div>
  );
};