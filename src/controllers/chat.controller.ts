import { Request, Response } from 'express';
import { AppError } from '../middleware/error.middleware';
import { generateChatAnswer } from '../services/chat.service';
import { getConversationHistory } from '../services/conversation.service';
import { asyncHandler } from '../utils/asyncHandler';

interface ChatRequestBody {
  question?: unknown;
}

interface ChatHistoryQuery {
  page?: string | string[];
  limit?: string | string[];
}

const parsePositiveInteger = (value: string | string[] | undefined, fallback: number): number => {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return fallback;
  }

  const parsed = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new AppError('page and limit must be positive integers', 400);
  }

  return parsed;
};

export const chatWithKnowledgeBase = asyncHandler(
  async (req: Request<unknown, unknown, ChatRequestBody>, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { question } = req.body;

    if (typeof question !== 'string' || !question.trim()) {
      throw new AppError('Question is required', 400);
    }

    const result = await generateChatAnswer(question, req.user.userId);

    res.status(200).json({
      answer: result.answer,
    });
  },
);

export const getChatHistory = asyncHandler(
  async (req: Request<unknown, unknown, unknown, ChatHistoryQuery>, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const page = parsePositiveInteger(req.query.page, 1);
    const limit = parsePositiveInteger(req.query.limit, 10);

    const { conversations, total } = await getConversationHistory(req.user.userId, page, limit);

    res.status(200).json({
      success: true,
      data: {
        conversations,
        pagination: {
          page,
          limit,
          total,
        },
      },
    });
  },
);
