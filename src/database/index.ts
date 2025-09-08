import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to MongoDB using environment variables
const connectDB = async () => {
  const dbUrl =
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('FATAL ERROR: DATABASE_URL not found in .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUrl);

    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB connected successfully.');
    }
  } catch (error) {
    console.error('FATAL ERROR: Could not connect to MongoDB.', error);
    process.exit(1);
  }
};

export default connectDB;
