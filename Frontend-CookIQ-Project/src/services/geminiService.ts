import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateBlogContent = async (topic: string, category: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Cannot generate content.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a helpful, engaging, and formatted (using Markdown) blog post for an organic food website called "CookIQ".
    Topic: ${topic}
    Category: ${category}
    Language: Vietnamese (Tiếng Việt).
    Keep it under 500 words. Focus on health benefits or cooking tips.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please try again later.";
  }
};