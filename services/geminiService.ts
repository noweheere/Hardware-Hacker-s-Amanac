import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AnalysisResult } from '../types';

function base64ToPart(base64Data: string, mimeType: string) {
    return {
        inlineData: {
            data: base64Data.split(',')[1],
            mimeType
        }
    };
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        componentName: { type: Type.STRING, description: "Name des Bauteils" },
        description: { type: Type.STRING, description: "Kurze Beschreibung des Bauteils und seiner Funktion." },
        specifications: {
            type: Type.OBJECT,
            description: "Ein Objekt mit wichtigen technischen Spezifikationen (z.B. Spannung, Strom, Frequenz). Keys sind die Namen der Spezifikation, Values die Werte.",
        },
        datasheetUrl: { type: Type.STRING, description: "Ein Link zum offiziellen Datenblatt des Bauteils." },
        hackingGuide: { type: Type.STRING, description: "Eine kurze Anleitung oder Ideen für Hacking, Modding oder Reverse-Engineering des Bauteils." },
        recommendedTools: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Eine Liste empfohlener Werkzeuge für die Arbeit mit diesem Bauteil."
        },
        communityLinks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Links zu relevanten Foren, Community-Projekten oder Tutorials."
        }
    },
    required: ["componentName", "description", "specifications", "datasheetUrl", "hackingGuide", "recommendedTools", "communityLinks"]
};

export const analyzeComponent = async (prompt: string, imageBase64: string): Promise<AnalysisResult> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const imagePart = base64ToPart(imageBase64, 'image/jpeg');
        const textPart = { text: prompt };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as AnalysisResult;

        return result;

    } catch (error) {
        console.error("Fehler bei der Gemini-API-Analyse:", error);
        let errorMessage = "Unbekannter Fehler bei der Analyse.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Analyse fehlgeschlagen: ${errorMessage}`);
    }
};