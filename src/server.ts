import express, { Application } from 'express';
import mongoose from 'mongoose';
import connectDB from './database/index.js';
import regionRoutes from './routes/Region.routes.js';

/**
 * Initializes and starts the Express server.
 * Returns the app instance for testing purposes without starting the listener in test mode.
 */
export const startServer = async (): Promise<{ app: Application }> => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API is running and connected to DB!' });
  });

  app.use('/regions', regionRoutes);

  // Start server only if not in test mode
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  }

  return { app };
};

// Run server if executed directly and not in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer();
}
