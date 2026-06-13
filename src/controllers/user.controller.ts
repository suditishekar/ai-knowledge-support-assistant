import { Request, Response } from 'express';
import { UserRole } from '../models/user.types';
import { User } from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';

interface CreateUserBody {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body as CreateUserBody;

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    res.status(400).json({
      success: false,
      message: 'name, email, and password are required',
    });

    return;
  }

  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    ...(role ? { role } : {}),
  });

  const userObject = user.toObject();
  const { password: _password, ...userWithoutPassword } = userObject;

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: userWithoutPassword,
  });
});