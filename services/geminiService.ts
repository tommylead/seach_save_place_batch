import { GoogleGenAI, Type } from "@google/genai";
import { PlaceSuggestion, PlaceDetails } from "../types";

let ai: GoogleGenAI | null = null;
const model = "gemini-2.5-flash";

export const initializeGemini = (apiKey: string) => {
    if (!apiKey) {
        console.error("API key is missing.");
        throw new Error("API key is required to initialize Gemini service.");
    }
    ai = new GoogleGenAI({ apiKey });
};

const placeSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        place_id: { type: Type.STRING, description: "A unique identifier for the place." },
        name: { type: Type.STRING, description: "The name of the place." },
        formatted_address: { type: Type.STRING, description: "The full address of the place." },
        types: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of types describing the place (e.g., 'tourist_attraction')."
        },
    },
    required: ["place_id", "name", "formatted_address", "types"],
};

const placeDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        _id: { type: Type.STRING, description: "This should be the place_id provided in the prompt." },
        name: { type: Type.STRING },
        formatted_address: { type: Type.STRING },
        types: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        summary: {
            type: Type.STRING,
            description: "A concise and engaging summary of the place, suitable for a travel app. Highlight key features and what makes it special.",
        },
    },
    required: ["_id", "name", "formatted_address", "types", "summary"],
};

const checkInitialization = () => {
    if (!ai) {
        throw new Error("Gemini service not initialized. Please set the API key first.");
    }
};

export const searchPlaces = async (query: string): Promise<PlaceSuggestion[]> => {
    checkInitialization();
    if (!query.trim()) {
        return [];
    }
    try {
        const response = await ai!.models.generateContent({
            model,
            contents: `Find places matching "${query}". Return a list of relevant suggestions with their Google Places place_id, name, formatted address, and types.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: placeSuggestionSchema,
                },
            },
        });

        const jsonString = response.text.trim();
        const results = JSON.parse(jsonString);
        return results as PlaceSuggestion[];
    } catch (error)
    {
        console.error("Error searching places:", error);
        // Check for API key specific errors
        if (error instanceof Error && error.message.includes('API_KEY_INVALID')) {
             throw new Error("The provided API key is invalid. Please check and re-enter it.");
        }
        throw new Error("Failed to fetch place suggestions. The API key might be invalid or the service is unavailable.");
    }
};

export const savePlace = async (placeId: string, placeName: string): Promise<PlaceDetails> => {
    checkInitialization();
    try {
        const response = await ai!.models.generateContent({
            model,
            contents: `Provide detailed information for the place named "${placeName}" with place_id "${placeId}". The response should include the place_id (as _id), name, formatted address, types, and a compelling summary for a tourist.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: placeDetailsSchema
            },
        });

        const jsonString = response.text.trim();
        const placeDetails = JSON.parse(jsonString);

        if (placeDetails._id !== placeId) {
             console.warn(`Mismatched place_id. Requested: ${placeId}, Received: ${placeDetails._id}. Overwriting to ensure consistency.`);
             placeDetails._id = placeId;
        }

        return placeDetails as PlaceDetails;
    } catch (error) {
        console.error("Error saving place details:", error);
        if (error instanceof Error && error.message.includes('API_KEY_INVALID')) {
             throw new Error("The provided API key is invalid. Please check and re-enter it.");
        }
        throw new Error("Failed to fetch place details from Gemini API.");
    }
};

export const refreshPlaceSummary = async (place: PlaceDetails): Promise<PlaceDetails> => {
    checkInitialization();
    try {
        const response = await ai!.models.generateContent({
            model,
            contents: `Generate a new, fresh, and engaging summary for the following place, suitable for a travel app. Keep it concise. Place name: "${place.name}", Address: "${place.formatted_address}".`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: {
                            type: Type.STRING,
                            description: "A new, concise, and engaging summary for the place.",
                        },
                    },
                    required: ["summary"],
                },
            },
        });

        const jsonString = response.text.trim();
        const { summary } = JSON.parse(jsonString);
        return { ...place, summary };

    } catch (error) {
        console.error("Error refreshing place summary:", error);
         if (error instanceof Error && error.message.includes('API_KEY_INVALID')) {
             throw new Error("The provided API key is invalid. Please check and re-enter it.");
        }
        throw new Error("Failed to refresh summary from Gemini API.");
    }
}
