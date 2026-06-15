import { Request, Response } from 'express';
import { AppError } from '../middleware/error.middleware';
import { searchChunksByQuery } from '../services/search.service';
import { asyncHandler } from '../utils/asyncHandler';

export const searchChunks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = req.body?.query;

  if (typeof query !== 'string' || !query.trim()) {
    throw new AppError('Query is required', 400);
  }

  const result = await searchChunksByQuery(query);

  res.status(200).json({
    matches: result.matches,
  });
});