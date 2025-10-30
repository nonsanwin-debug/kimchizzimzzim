
import { GoogleGenAI, Type } from "@google/genai";

interface Suggestion {
    unit: string;
    lowStockThreshold: number;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const suggestItemDetails = async (itemName: string): Promise<Suggestion | null> => {
    try {
        const prompt = `
            You are an expert inventory management assistant for a Korean delivery restaurant.
            Based on the inventory item name, suggest a common unit and a reasonable low-stock threshold for a small-to-medium-sized delivery business.
            
            Item Name: ${itemName}
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                unit: {
                    type: Type.STRING,
                    description: "The common unit for this item (e.g., kg, L, 개, 박스)."
                },
                lowStockThreshold: {
                    type: Type.NUMBER,
                    description: "A reasonable low-stock warning threshold for this item."
                }
            },
            required: ["unit", "lowStockThreshold"]
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const text = response.text.trim();
        const parsedJson = JSON.parse(text);

        if (parsedJson && typeof parsedJson.unit === 'string' && typeof parsedJson.lowStockThreshold === 'number') {
            return parsedJson as Suggestion;
        }

        return null;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get suggestions from AI.");
    }
};
