import { GoogleGenerativeAI, GenerateContentResponse, SchemaType } from "@google/generative-ai";
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
    type: SchemaType.OBJECT,
    properties: {
        componentName: { type: SchemaType.STRING, description: "Name des Bauteils" },
        description: { type: SchemaType.STRING, description: "Kurze Beschreibung des Bauteils und seiner Funktion." },
        specifications: {
            type: SchemaType.OBJECT,
            description: "Ein Objekt mit wichtigen technischen Spezifikationen (z.B. Spannung, Strom, Frequenz). Keys sind die Namen der Spezifikation, Values die Werte.",
        },
        datasheetUrl: { type: SchemaType.STRING, description: "Ein Link zum offiziellen Datenblatt des Bauteils." },
        hackingGuide: { type: SchemaType.STRING, description: "Eine kurze Anleitung oder Ideen für Hacking, Modding oder Reverse-Engineering des Bauteils." },
        recommendedTools: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Eine Liste empfohlener Werkzeuge für die Arbeit mit diesem Bauteil."
        },
        communityLinks: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Links zu relevanten Foren, Community-Projekten oder Tutorials."
        }
    },
    required: ["componentName", "description", "specifications", "datasheetUrl", "hackingGuide", "recommendedTools", "communityLinks"]
};

export const analyzeComponent = async (prompt: string, imageBase64: string): Promise<AnalysisResult> => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');
    try {
        const imagePart = base64ToPart(imageBase64, 'image/jpeg');
        const textPart = { text: prompt };

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const response: GenerateContentResponse = await model.generateContent([imagePart, textPart]);

        const jsonText = response.response.text().trim();
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