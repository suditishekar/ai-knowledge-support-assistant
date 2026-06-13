import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserRole } from '../models/user.types';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export const signAuthToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
};