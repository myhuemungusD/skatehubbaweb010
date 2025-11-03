import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './config/env';

const genAI = new GoogleGenerativeAI(env.GOOGLE_AI_API_KEY || '');

// Get the Gemini Pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Generate text using Google's Gemini Pro AI model
 * @param prompt - Text prompt to generate content from
 * @returns Promise resolving to generated text
 * @throws Error if generation fails
 */
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

/**
 * Generate text as a stream using Google's Gemini Pro AI model
 * Useful for progressive rendering of AI responses
 * @param prompt - Text prompt to generate content from
 * @returns Promise resolving to async iterable stream of text chunks
 * @throws Error if generation fails
 */
export async function generateTextStream(prompt: string) {
  try {
    const result = await model.generateContentStream(prompt);
    return result.stream;
  } catch (error) {
    console.error('Error generating streamed text with Gemini:', error);
    throw error;
  }
}

/**
 * Generate content from text prompt and image data (multimodal)
 * Allows AI to analyze and respond to image content
 * @param prompt - Text prompt describing what to do with the image
 * @param imageData - Base64-encoded image data
 * @returns Promise resolving to generated text based on image and prompt
 * @throws Error if generation fails
 */
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
