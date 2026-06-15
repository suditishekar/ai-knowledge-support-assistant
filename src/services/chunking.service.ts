import { Types } from 'mongoose';
import { AppError } from '../middleware/error.middleware';
import { Chunk } from '../models/chunk.model';
import { Document } from '../models/document.model';

interface ChunkGenerationResult {
  chunksCreated: number;
}

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

const splitTextIntoChunks = (text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] => {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return [];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < normalizedText.length) {
    const endIndex = Math.min(startIndex + chunkSize, normalizedText.length);
    const chunk = normalizedText.slice(startIndex, endIndex).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (endIndex >= normalizedText.length) {
      break;
    }

    startIndex = Math.max(0, endIndex - overlap);
  }

  return chunks;
};

const estimateTokenCount = (text: string): number => {
  const words = text.trim().match(/\S+/g);
  return words?.length ?? 0;
};

export const generateChunksForDocument = async (documentId: string): Promise<ChunkGenerationResult> => {
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError('Document not found', 404);
  }

  if (document.status !== 'EXTRACTED') {
    throw new AppError('Document must be extracted before chunking', 400);
  }

  const sourceText = document.extractedText?.trim() ?? '';

  if (!sourceText) {
    throw new AppError('No extracted text available for chunking', 400);
  }

  const chunks = splitTextIntoChunks(sourceText);

  if (!chunks.length) {
    throw new AppError('Unable to generate chunks from extracted text', 400);
  }

  await Chunk.deleteMany({ documentId: new Types.ObjectId(documentId) });

  const chunkDocuments = chunks.map((chunkText, index) => ({
    documentId: new Types.ObjectId(documentId),
    chunkIndex: index,
    text: chunkText,
    tokenCount: estimateTokenCount(chunkText),
  }));

  await Chunk.insertMany(chunkDocuments);

  document.status = 'CHUNKED';
  await document.save();

  return {
    chunksCreated: chunkDocuments.length,
  };
};