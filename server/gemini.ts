import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './config/env';

const genAI = new GoogleGenerativeAI(env.GOOGLE_AI_API_KEY || '');

// Get the Gemini Pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateText(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw error;
  }
}

export async function generateTextStream(prompt: string) {
  try {
    const result = await model.generateContentStream(prompt);
    return result.stream;
  } catch (error) {
    console.error('Error generating streamed text with Gemini:', error);
    throw error;
  }
}

// For multimodal content (text + images)
export async function generateFromTextAndImage(prompt: string, imageData: string) {
  try {
    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: "image/jpeg"
      }
    };
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content from text and image:', error);
    throw error;
  }
}
