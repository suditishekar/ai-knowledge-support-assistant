import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';

const primaryConfig = dotenv.config();

if (primaryConfig.error) {
  dotenv.config({ path: '.env.example' });
}

const mongoUriValue = process.env.MONGODB_URI ?? '';
const jwtSecretValue = process.env.JWT_SECRET ?? '';

if (!mongoUriValue.trim()) {
  throw new Error('Missing required environment variable: MONGODB_URI');
}

if (!jwtSecretValue.trim()) {
  throw new Error('Missing required environment variable: JWT_SECRET');
}

const mongoUri = mongoUriValue.trim();
const jwtSecret = jwtSecretValue.trim();

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  mongoUri,
  jwtSecret,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as NonNullable<SignOptions['expiresIn']>,
};
