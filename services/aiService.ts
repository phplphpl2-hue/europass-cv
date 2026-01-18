import { GoogleGenAI } from "@google/genai";
import { AIRequestParams } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-3-flash-preview';

export const generateCVSuggestion = async (params: AIRequestParams): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment.";
  }

  let prompt = "";

  switch (params.type) {
    case 'summary':
      prompt = `You are a professional career coach. Write a concise, professional CV profile summary (max 80 words) for a person with the following details: ${params.context}. Use active voice and professional terminology.`;
      break;
    case 'improve_work':
      prompt = `You are a professional resume editor. Rewrite the following job description bullet points to be more impactful, using action verbs and result-oriented language. Keep it concise. Original text: "${params.currentText}". Context: ${params.context}`;
      break;
    case 'suggest_skills':
      prompt = `List 10 key technical and soft skills (comma separated) relevant for a job title of "${params.context}". Return only the comma separated list.`;
      break;
    default:
      prompt = params.context;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "No suggestion generated.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Failed to generate suggestion. Please try again.";
  }
};