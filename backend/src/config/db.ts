import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../utils/logger';

// Prevent Mongoose from buffering commands for 10,000ms when disconnected
mongoose.set('bufferCommands', false);

export const connectDB = async (): Promise<typeof mongoose | null> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    logger.info(`[MongoDB Connected] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    logger.error('[MongoDB Connection Warning] Could not connect to MongoDB server:', error);
    return null;
  }
};
