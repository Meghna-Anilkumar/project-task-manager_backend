import { GoogleGenerativeAI } from '@google/generative-ai';

export const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY in environment variables');
    throw new Error('Missing or invalid GEMINI_API_KEY.');
  }

  console.log('Initializing GoogleGenerativeAI with API key');
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-2.5-pro", });
      console.log('Model initialized successfully:gemini-2.5-pro');
    } catch (error) {
      console.warn('failed to initate gemini', error);
      model = genAI.getGenerativeModel({ model: "gemini-2.5-pro", });
      console.log(' model initialized successfully: gemini-1.0-pro-001');
    }
    return model;
  } catch (error) {
    console.error('failed to initialize model:', error);
    throw new Error('Failed to initialize Gemini model: ' + (error as Error).message);
  }
};