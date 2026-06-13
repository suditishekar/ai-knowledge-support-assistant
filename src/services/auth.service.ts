import { User } from '../models/user.model';
import { AppError } from '../middleware/error.middleware';
import { LoginInput, RegisterInput } from '../auth.validation';
import { comparePassword, hashPassword } from '../utils/password';
import { signAuthToken } from '../utils/jwt';

export const registerUser = async (input: RegisterInput): Promise<void> => {
  const normalizedEmail = input.email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError('Email already exists', 409);
  }

  const hashedPassword = await hashPassword(input.password);

  await User.create({
    name: input.name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });
};

export const loginUser = async (input: LoginInput): Promise<string> => {
  const normalizedEmail = input.email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  return signAuthToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });
};