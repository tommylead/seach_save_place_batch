import React, { useState, useEffect } from 'react';
import { PlaceSearch } from './components/PlaceSearch';
import { SavedPlacesList } from './components/SavedPlacesList';
import { PlaceDetails } from './types';
import { ApiKeyModal } from './components/ApiKeyModal';
import { validateApiKey } from './services/geminiService';

const API_KEY_STORAGE_KEY = 'geminiApiKey';

function App() {
  const [savedPlaces, setSavedPlaces] = useState<PlaceDetails[]>(() => {
    try {
      const items = window.localStorage.getItem('savedPlaces');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });

  const [apiKey, setApiKey] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error("Error reading API key from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('savedPlaces', JSON.stringify(savedPlaces));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [savedPlaces]);


  const handlePlaceSaved = (place: PlaceDetails) => {
    // Prevent adding duplicates
    if (!savedPlaces.some(p => p._id === place._id)) {
      setSavedPlaces(prevPlaces => [place, ...prevPlaces]);
    }
  };

  const handleDeletePlace = (placeId: string) => {
    setSavedPlaces(prevPlaces => prevPlaces.filter(p => p._id !== placeId));
  };

  const handleUpdatePlace = (updatedPlace: PlaceDetails) => {
    setSavedPlaces(prevPlaces => 
      prevPlaces.map(p => p._id === updatedPlace._id ? updatedPlace : p)
    );
  };

  const handleApiKeySubmit = async (key: string): Promise<boolean> => {
    const isValid = await validateApiKey(key);
    if (isValid) {
      try {
        window.localStorage.setItem(API_KEY_STORAGE_KEY, key);
        setApiKey(key);
        return true;
      } catch (error) {
        console.error("Error saving API key to localStorage", error);
        return false;
      }
    }
    return false;
  };

  if (!apiKey) {
    return <ApiKeyModal onKeySubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <h1 className="text-2xl font-bold text-slate-700">Place Finder & Saver</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <PlaceSearch onPlaceSaved={handlePlaceSaved} apiKey={apiKey} />
          </div>
          <div className="md:col-span-2">
            <SavedPlacesList 
              places={savedPlaces} 
              onDeletePlace={handleDeletePlace}
              onUpdatePlace={handleUpdatePlace}
              apiKey={apiKey}
            />
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-slate-500 text-sm">
        By Tommy Lee
      </footer>
    </div>
  );
}

export default App;