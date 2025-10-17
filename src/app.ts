import express, { Application } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import aiRoutes from './routes/aiRoutes';
import cookieParser from 'cookie-parser';
import { getGeminiModel } from './config/gemini';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors({
  origin: process.env.ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api/ai', aiRoutes);

// Debug route to verify server
app.get('/', (req, res) => {
  res.json({ message: 'API Server running on port 5000' });
});

// Test route to verify Gemini model
app.get('/api/test-gemini-model', async (req, res) => {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent('Test prompt: Summarize "Hello world" in one sentence.');
    const text = (await result.response).text();
    res.json({ success: true, model: model.model, text });
  } catch (error: any) {
    console.error('[Test Gemini Model] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default app;