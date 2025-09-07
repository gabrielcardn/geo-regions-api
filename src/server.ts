import express from 'express';
import connectDB from './database';
import regionRoutes from './routes/Region.routes'; // 1. Importe as rotas

const startServer = async () => {
  await connectDB();
  
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API is running and connected to DB!' });
  });

  // 2. Use as rotas de região com um prefixo
  app.use('/regions', regionRoutes); 

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

startServer();