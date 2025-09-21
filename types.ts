// FIX: Define the data structures used throughout the application.
export interface PlaceSuggestion {
  place_id: string;
  name: string;
  formatted_address: string;
  types: string[];
}

export interface PlaceDetails {
  _id: string; // Corresponds to place_id
  name: string;
  formatted_address: string;
  types: string[];
  summary: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}
