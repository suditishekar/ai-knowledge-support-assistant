import express from 'express';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import documentRoutes from './routes/document.routes';
import healthRoutes from './routes/health.routes';
import searchRoutes from './routes/search.routes';
import userRoutes from './routes/user.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/health', healthRoutes);
  app.use('/users', userRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const app = createApp();
