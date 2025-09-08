import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  const dbUrl =
    process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error("DATABASE_URL not found in .env file");
    process.exit(1); // Encerra a aplicação se a URL não estiver definida
  }

  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Encerra a aplicação em caso de falha na conexão
  }
};

export default connectDB;
