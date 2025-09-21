import React, { useState } from 'react';
import { PlaceDetails } from '../types';
import { refreshPlaceSummary } from '../services/geminiService';
import { Spinner } from './Spinner';

interface SavedPlaceItemProps {
  place: PlaceDetails;
  onDeletePlace: (id: string) => void;
  onUpdatePlace: (place: PlaceDetails) => void;
  apiKey: string;
}

export const SavedPlaceItem: React.FC<SavedPlaceItemProps> = ({ place, onDeletePlace, onUpdatePlace, apiKey }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setError(null);
        try {
            const updatedPlace = await refreshPlaceSummary(apiKey, place);
            onUpdatePlace(updatedPlace);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setIsRefreshing(false);
        }
    };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{place.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{place.formatted_address}</p>
          {place.location && (
            <p className="text-xs text-slate-400 mt-1" aria-label={`Coordinates: Latitude ${place.location.lat}, Longitude ${place.location.lng}`}>
              Lat: {place.location.lat.toFixed(6)}, Lng: {place.location.lng.toFixed(6)}
            </p>
          )}
        </div>
        <button
          onClick={() => onDeletePlace(place._id)}
          className="text-slate-400 hover:text-red-600 transition-colors"
          aria-label={`Delete ${place.name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {place.types.slice(0, 4).map(type => (
          <span key={type} className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
            {type.replace(/_/g, ' ')}
          </span>
        ))}
      </div>
      <p className="mt-4 text-slate-600 text-base leading-relaxed">{place.summary}</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
         <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-36"
         >
            {isRefreshing ? <><Spinner/> <span className="ml-2">Refreshing...</span></> : 'Refresh Summary'}
         </button>
      </div>
    </div>
  );
};