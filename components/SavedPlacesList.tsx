import React from 'react';
import { PlaceDetails } from '../types';
import { SavedPlaceItem } from './SavedPlaceItem';

interface SavedPlacesListProps {
  places: PlaceDetails[];
  onDeletePlace: (id: string) => void;
  onUpdatePlace: (place: PlaceDetails) => void;
}

export const SavedPlacesList: React.FC<SavedPlacesListProps> = ({ places, onDeletePlace, onUpdatePlace }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">Saved Locations</h2>
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
