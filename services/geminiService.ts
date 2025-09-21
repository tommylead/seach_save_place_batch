// FIX: Implement Gemini API calls following the coding guidelines.
import { GoogleGenAI, Type } from "@google/genai";
import { PlaceSuggestion, PlaceDetails } from "../types";

const model = "gemini-2.5-flash";

const placeSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        place_id: { type: Type.STRING, description: "A unique identifier for the place." },
        name: { type: Type.STRING, description: "The name of the place." },
        formatted_address: { type: Type.STRING, description: "The full address of the place." },
        types: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Một mảng các loại hình mô tả địa điểm bằng tiếng Việt (ví dụ: 'địa điểm du lịch')."
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
            description: "Một mảng các thẻ mô tả địa điểm bằng tiếng Việt (ví dụ: 'di tích lịch sử', 'công viên giải trí')."
        },
        summary: {
            type: Type.STRING,
            description: "Một bản tóm tắt súc tích và hấp dẫn về địa điểm bằng tiếng Việt, phù hợp cho một ứng dụng du lịch. Nêu bật các đặc điểm chính và điều làm cho nó đặc biệt.",
        },
        location: {
            type: Type.OBJECT,
            properties: {
                lat: { type: Type.NUMBER, description: "The latitude coordinate of the place." },
                lng: { type: Type.NUMBER, description: "The longitude coordinate of the place." }
            },
            required: ["lat", "lng"],
            description: "The geographical coordinates of the place."
        }
    },
    required: ["_id", "name", "formatted_address", "types", "summary", "location"],
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey) return false;
    try {
        const ai = new GoogleGenAI({ apiKey });
        // Make a lightweight, inexpensive call to validate the key
        const response = await ai.models.generateContent({
            model,
            contents: "hi",
        });
        
        // A truly valid key will result in a response with actual text content.
        // Some invalid keys might not throw an error but will return an empty response.
        // This check ensures we get a meaningful response.
        if (response.text && response.text.trim().length > 0) {
            return true;
        } else {
            console.error("API Key validation failed: Model returned no content.");
            return false;
        }

    } catch (error) {
        // This is the expected path for most invalid key errors (e.g., HTTP 400).
        console.error("API Key validation failed with an error:", error);
        return false;
    }
};


export const searchPlaces = async (apiKey: string, query: string): Promise<PlaceSuggestion[]> => {
    if (!query.trim()) {
        return [];
    }
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model,
            contents: `Tìm các địa điểm khớp với "${query}". Trả về danh sách các gợi ý liên quan với place_id, tên, địa chỉ định dạng và các loại hình (types) bằng tiếng Việt.`,
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
    } catch (error) {
        console.error("Error searching places:", error);
        throw new Error("Failed to fetch place suggestions. Check your API key and network connection.");
    }
};

export const savePlace = async (apiKey: string, placeId: string, placeName: string): Promise<PlaceDetails> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model,
            contents: `Cung cấp thông tin chi tiết cho địa điểm có tên "${placeName}" với place_id "${placeId}". Phản hồi phải bao gồm place_id (dưới dạng _id), tên, địa chỉ định dạng, tọa độ vị trí (vĩ độ, kinh độ), cùng với một bản tóm tắt (summary) và các thẻ (types) hấp dẫn bằng tiếng Việt cho khách du lịch.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: placeDetailsSchema
            },
        });

        const jsonString = response.text.trim();
        const placeDetails = JSON.parse(jsonString);

        // Ensure the _id from the response matches the requested placeId for data integrity.
        if (placeDetails._id !== placeId) {
             console.warn(`Mismatched place_id. Requested: ${placeId}, Received: ${placeDetails._id}. Overwriting to ensure consistency.`);
             placeDetails._id = placeId;
        }

        return placeDetails as PlaceDetails;
    } catch (error) {
        console.error("Error saving place details:", error);
        throw new Error("Failed to fetch place details. Check your API key and network connection.");
    }
};

export const refreshPlaceSummary = async (apiKey: string, place: PlaceDetails): Promise<PlaceDetails> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model,
            contents: `Tạo một bản tóm tắt mới, hấp dẫn và súc tích bằng tiếng Việt cho địa điểm sau, phù hợp cho một ứng dụng du lịch. Tên địa điểm: "${place.name}", Địa chỉ: "${place.formatted_address}".`,
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
        throw new Error("Failed to refresh summary. Check your API key and network connection.");
    }
}