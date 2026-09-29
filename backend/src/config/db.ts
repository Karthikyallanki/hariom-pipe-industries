import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<typeof mongoose | null> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2500, // Fast 2.5s connection attempt
    });
    logger.info(`[MongoDB Connected] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    logger.error('[MongoDB Connection Warning] Could not connect to MongoDB server:', error);
    return null;
  }
};
