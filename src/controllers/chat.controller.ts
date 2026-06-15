import { Request, Response } from 'express';
import { AppError } from '../middleware/error.middleware';
import { generateChatAnswer } from '../services/chat.service';
import { asyncHandler } from '../utils/asyncHandler';

interface ChatRequestBody {
  question?: unknown;
}

export const chatWithKnowledgeBase = asyncHandler(
  async (req: Request<unknown, unknown, ChatRequestBody>, res: Response): Promise<void> => {
    const { question } = req.body;

    if (typeof question !== 'string' || !question.trim()) {
      throw new AppError('Question is required', 400);
    }

    const result = await generateChatAnswer(question);

    res.status(200).json({
      answer: result.answer,
    });
  },
);
