import mongoose from 'mongoose';
import { config } from './env';

export const connectDatabase = async (): Promise<void> => {
  mongoose.set('strictQuery', true);

  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  });
};
