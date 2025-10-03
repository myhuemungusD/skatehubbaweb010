
import express from 'express';
import { generateText, generateTextStream } from './gemini.ts';

const router = express.Router();

// Simple text generation endpoint
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const text = await generateText(prompt);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate text' });
  }
});

// Streaming text generation endpoint
router.post('/generate-stream', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const stream = await generateTextStream(prompt);
    
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    });
    
    for await (const chunk of stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }
    
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate streamed text' });
  }
});

export default router;
