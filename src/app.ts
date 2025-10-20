import express, { Application } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import aiRoutes from './routes/aiRoutes';
import cookieParser from 'cookie-parser';

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


app.get('/', (req, res) => {
  res.json({ message: 'API Server running on port 5000' });
});



export default app;