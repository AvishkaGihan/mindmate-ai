import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import moodRoutes from './routes/mood.routes';
import journalRoutes from './routes/journal.routes';
import chatRoutes from './routes/chat.routes';
import syncRoutes from './routes/sync.routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Route Mounting
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/moods', moodRoutes);
app.use('/api/v1/journals', journalRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/sync', syncRoutes);

// Error Middleware
app.use(errorHandler);

export { app };
