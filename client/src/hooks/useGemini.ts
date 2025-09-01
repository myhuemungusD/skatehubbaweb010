
import { useState } from 'react';
import ky from 'ky';

export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateText = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ky.post('/api/gemini/generate', {
        json: { prompt }
      }).json<{ text: string }>();
      
      return response.text;
    } catch (err) {
      const errorMessage = 'Failed to generate text';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateText,
    isLoading,
    error
  };
}
