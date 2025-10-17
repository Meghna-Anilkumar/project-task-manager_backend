import { GoogleGenerativeAI } from '@google/generative-ai';

export const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[Gemini] Missing GEMINI_API_KEY in environment variables');
    throw new Error('Missing or invalid GEMINI_API_KEY. Please check your .env file.');
  }

  console.log('[Gemini] Initializing GoogleGenerativeAI with API key');
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", });
      console.log('[Gemini] Model initialized successfully: gemini-1.5-pro');
    } catch (error) {
      console.warn('[Gemini] Failed to initialize gemini-1.5-pro, trying fallback model gemini-1.0-pro-001:', error);
      model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", });
      console.log('[Gemini] Fallback model initialized successfully: gemini-1.0-pro-001');
    }
    return model;
  } catch (error) {
    console.error('[Gemini] Failed to initialize model:', error);
    throw new Error('Failed to initialize Gemini model: ' + (error as Error).message);
  }
};