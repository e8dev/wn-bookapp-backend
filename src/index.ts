// src/index.ts

import express, { Application, Request, Response, NextFunction } from 'express';
import routes from './routes';
import { initializeDatabase } from './database/connection';
import cors from 'cors';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3009');

async function startServer() {
  await initializeDatabase();

  app.use(cors());
  app.use(express.json());
  
  // Mount API routes
  app.use('/api', routes);
  
  // Index /
  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello, World!');
  });
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
