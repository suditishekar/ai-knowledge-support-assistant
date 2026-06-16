import { Types } from 'mongoose';
import { Conversation } from '../models/conversation.model';

export interface ConversationHistoryItem {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  question: string;
  answer: string;
  sourceChunkIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConversationInput {
  userId: string;
  question: string;
  answer: string;
  sourceChunkIds: Types.ObjectId[];
}

export const createConversation = async (input: CreateConversationInput): Promise<void> => {
  await Conversation.create({
    userId: new Types.ObjectId(input.userId),
    question: input.question.trim(),
    answer: input.answer.trim(),
    sourceChunkIds: input.sourceChunkIds,
  });
};

export const getConversationHistory = async (
  userId: string,
  page: number,
  limit: number,
): Promise<{ conversations: ConversationHistoryItem[]; total: number }> => {
  const filter = {
    userId: new Types.ObjectId(userId),
  };

  const total = await Conversation.countDocuments(filter);

  const conversations = await Conversation.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean<ConversationHistoryItem[]>();

  return { conversations, total };
};

export const getRecentConversations = async (limit = 10): Promise<ConversationHistoryItem[]> => {
  return Conversation.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<ConversationHistoryItem[]>();
};