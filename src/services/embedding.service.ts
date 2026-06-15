import { Types } from 'mongoose';
import { AppError } from '../middleware/error.middleware';
import { Chunk } from '../models/chunk.model';
import { Document } from '../models/document.model';
import { createEmbeddingProvider } from './embedding-providers/embedding-provider.factory';

interface EmbeddingGenerationResult {
  chunksEmbedded: number;
}

const embeddingProvider = createEmbeddingProvider();

export const generateEmbeddingsForDocument = async (documentId: string): Promise<EmbeddingGenerationResult> => {
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError('Document not found', 404);
  }

  if (document.status !== 'CHUNKED') {
    throw new AppError('Document must be chunked before embedding', 400);
  }

  const chunks = await Chunk.find({ documentId: new Types.ObjectId(documentId) }).sort({ chunkIndex: 1 });

  if (!chunks.length) {
    throw new AppError('No chunks found for embedding', 400);
  }

  try {
    for (const chunk of chunks) {
      const embedding = await embeddingProvider.generateEmbedding(chunk.text);
      chunk.embedding = embedding;
      await chunk.save();
    }

    document.status = 'EMBEDDED';
    await document.save();

    return {
      chunksEmbedded: chunks.length,
    };
  } catch {
    throw new AppError('Failed to generate embeddings for document', 500);
  }
};