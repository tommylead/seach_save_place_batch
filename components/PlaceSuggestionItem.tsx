
import React from 'react';
import { PlaceSuggestion } from '../types';
import { Spinner } from './Spinner';

interface PlaceSuggestionItemProps {
  suggestion: PlaceSuggestion;
  onSave: () => void;
  isSaving: boolean;
}

export const PlaceSuggestionItem: React.FC<PlaceSuggestionItemProps> = ({ suggestion, onSave, isSaving }) => {
  return (
    <div className="p-4 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-slate-800">{suggestion.name}</h3>
        <p className="text-sm text-slate-500">{suggestion.formatted_address}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {suggestion.types.slice(0, 3).map(type => (
            <span key={type} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {type.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-24"
      >
        {isSaving ? <Spinner /> : 'Save'}
      </button>
    </div>
  );
};
