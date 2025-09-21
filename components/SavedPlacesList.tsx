import React from 'react';
import { PlaceDetails } from '../types';
import { SavedPlaceItem } from './SavedPlaceItem';

interface SavedPlacesListProps {
  places: PlaceDetails[];
  onDeletePlace: (id: string) => void;
  onUpdatePlace: (place: PlaceDetails) => void;
}

export const SavedPlacesList: React.FC<SavedPlacesListProps> = ({ places, onDeletePlace, onUpdatePlace }) => {
  const handleExport = () => {
    if (places.length === 0) return;

    const exportData = places.map(place => ({
      name: place.name,
      address: place.formatted_address,
      description: place.summary,
      tags: place.types,
      location: place.location || null
    }));

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'saved_places.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-700">Saved Locations</h2>
        {places.length > 0 && (
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center"
            aria-label="Export saved places to a JSON file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to JSON
          </button>
        )}
      </div>
      {places.length > 0 ? (
        <div className="space-y-6">
          {places.map((place) => (
            <SavedPlaceItem
              key={place._id}
              place={place}
              onDeletePlace={onDeletePlace}
              onUpdatePlace={onUpdatePlace}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-500 p-8 bg-slate-50 rounded-md border-2 border-dashed border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No saved places</h3>
            <p className="mt-1 text-sm text-slate-500">Search for a location to save it here.</p>
        </div>
      )}
    </div>
  );
};