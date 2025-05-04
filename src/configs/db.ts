import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from './env.configs';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI || 'mongodb+srv://jacksoncheriyan05:zr1oeRMXeFHZ8mmD@cluster0.t0qgz.mongodb.net/');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};

export default connectDB;