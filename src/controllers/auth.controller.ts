import { Request, Response } from 'express';
import { loginSchema, registerSchema } from '../auth.validation';
import { loginUser, registerUser } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/error.middleware';
import { User } from '../models/user.model';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const parsedBody = registerSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError(parsedBody.error.issues[0]?.message ?? 'Invalid request body', 400);
  }

  await registerUser(parsedBody.data);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
  });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const parsedBody = loginSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError(parsedBody.error.issues[0]?.message ?? 'Invalid request body', 400);
  }

  const token = await loginUser(parsedBody.data);

  res.status(200).json({
    success: true,
    token,
  });
});

export const profile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await User.findById(req.user.userId).select('name email role');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

export const authTest = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Access granted',
  });
});