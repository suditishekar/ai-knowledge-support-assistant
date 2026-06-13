import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AppError } from './error.middleware';
import { UserRole } from '../models/user.types';

export const authorize = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Unauthorized', 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError('Forbidden', 403));
      return;
    }

    next();
  };
};