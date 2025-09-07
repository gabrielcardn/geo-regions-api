import mongoose from 'mongoose';
import 'dotenv/config'; // Garante que as variáveis de ambiente do .env sejam carregadas

const connectDB = async () => {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('DATABASE_URL not found in .env file');
    process.exit(1); // Encerra a aplicação se a URL não estiver definida
  }

  try {
    await mongoose.connect(dbUrl);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Encerra a aplicação em caso de falha na conexão
  }
};

export default connectDB;