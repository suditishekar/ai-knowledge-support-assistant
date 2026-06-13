import { NextFunction, Request, Response } from 'express';
import { AppError } from './error.middleware';
import { verifyAuthToken } from '../utils/jwt';

export const authenticateUser = (req: Request, _res: Response, next: NextFunction): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    next(new AppError('Unauthorized', 401));
    return;
  }

  const token = authorizationHeader.slice(7).trim();

  if (!token) {
    next(new AppError('Unauthorized', 401));
    return;
  }

  try {
    req.user = verifyAuthToken(token);
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};