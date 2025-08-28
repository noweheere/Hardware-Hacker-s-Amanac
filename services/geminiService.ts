
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        componentName: { type: Type.STRING, description: "The identified name of the hardware component (e.g., ESP32-WROOM-32, Raspberry Pi 4 Model B)." },
        description: { type: Type.STRING, description: "A brief, one-paragraph description of the component and its primary function." },
        specifications: {
            type: Type.ARRAY,
            description: "A list of key technical specifications as strings.",
            items: { type: Type.STRING }
        },
        datasheetUrl: { type: Type.STRING, description: "A direct URL to the official datasheet PDF or webpage, if available. Otherwise, an empty string." },
        tutorials: {
            type: Type.ARRAY,
            description: "A list of relevant hardware hacking tutorials or guides.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING },
                    description: { type: Type.STRING, description: "A short summary of what the tutorial covers." }
                },
                required: ["title", "url", "description"]
            }
        },
        tools: {
            type: Type.ARRAY,
            description: "A list of recommended software or hardware tools for hacking this component.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    url: { type: Type.STRING },
                    description: { type: Type.STRING, description: "What the tool is used for." }
                },
                required: ["name", "url", "description"]
            }
        },
        communities: {
            type: Type.ARRAY,
            description: "A list of online communities (forums, subreddits, Discord servers) where this hardware is discussed.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    url: { type: Type.STRING }
                },
                required: ["name", "url"]
            }
        }
    },
    required: ["componentName", "description", "specifications", "datasheetUrl", "tutorials", "tools", "communities"]
};

const getPrompt = (textInput?: string) => {
    const basePrompt = `
      You are an expert hardware engineer and security researcher.
      Analyze the provided input (image or text) to identify the hardware component.
      Provide a detailed analysis including the component's name, description, key specifications, a datasheet URL, potential hardware hacking tutorials (like JTAG debugging, firmware flashing, UART access), recommended tools, and relevant online communities.
      Return the information in the specified JSON format. If a piece of information cannot be found, provide an empty string or empty array.
    `;
    if (textInput) {
        return `${basePrompt}\n\nThe user provided the following text: "${textInput}"`;
    }
    return basePrompt;
};

// FIX: Refactored to use process.env.API_KEY as per the guidelines, removing the apiKey parameter.
export const analyzeHardware = async (textInput?: string, imageBase64?: string, mimeType?: string): Promise<AnalysisResult> => {
    // FIX: Initialize with API_KEY from environment variables as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const prompt = getPrompt(textInput);
    const parts = [];

    if (imageBase64 && mimeType) {
        parts.push({
            inlineData: {
                data: imageBase64,
                mimeType: mimeType,
            },
        });
    }
    
    parts.push({ text: prompt });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            }
        });

        const jsonString = response.text;
        const result = JSON.parse(jsonString);
        return result as AnalysisResult;

    // FIX: Corrected syntax for catch block from '=> {' to '{'.
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from Gemini API. Check if your API key is valid, the component is identifiable, or if there's a network issue.");
    }
};
