import { Document } from '../models/document.model';
import { User } from '../models/user.model';
import { Chunk } from '../models/chunk.model';
import { Conversation } from '../models/conversation.model';
import { ConversationHistoryItem } from './conversation.service';

export interface RecentUploadItem {
  _id: unknown;
  filename: string;
  originalName: string;
  uploadedBy: unknown;
  status: string;
  extractedText?: string;
  textLength?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminStats {
  totalUsers: number;
  totalDocuments: number;
  totalChunks: number;
  totalChats: number;
}

export interface AdminActivity {
  recentUploads: RecentUploadItem[];
  recentChats: ConversationHistoryItem[];
}

export const getAdminStats = async (): Promise<AdminStats> => {
  const [totalUsers, totalDocuments, totalChunks, totalChats] = await Promise.all([
    User.countDocuments(),
    Document.countDocuments(),
    Chunk.countDocuments(),
    Conversation.countDocuments(),
  ]);

  return {
    totalUsers,
    totalDocuments,
    totalChunks,
    totalChats,
  };
};

export const getAdminActivity = async (): Promise<AdminActivity> => {
  const [recentUploads, recentChats] = await Promise.all([
    Document.find().sort({ createdAt: -1 }).limit(10).populate('uploadedBy', 'name email role').lean<RecentUploadItem[]>(),
    Conversation.find().sort({ createdAt: -1 }).limit(10).lean<ConversationHistoryItem[]>(),
  ]);

  return {
    recentUploads,
    recentChats,
  };
};