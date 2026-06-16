import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getAdminActivity, getAdminStats } from '../services/admin.service';

export const getStats = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const data = await getAdminStats();

  res.status(200).json({
    success: true,
    data,
  });
});

export const getActivity = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const data = await getAdminActivity();

  res.status(200).json({
    success: true,
    data,
  });
});