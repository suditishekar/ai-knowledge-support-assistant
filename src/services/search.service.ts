import { config } from '../config/env';
import { AppError } from '../middleware/error.middleware';
import { Chunk } from '../models/chunk.model';
import { createEmbeddingProvider } from './embedding-providers/embedding-provider.factory';

export interface SearchMatch {
  chunkId: string;
  score: number;
  text: string;
}

interface SearchResult {
  matches: SearchMatch[];
}

const embeddingProvider = createEmbeddingProvider();

export const searchChunksByQuery = async (
  query: string,
): Promise<SearchResult> => {
  try {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      throw new AppError('Query is required', 400);
    }

    const queryEmbedding =
      await embeddingProvider.generateEmbedding(normalizedQuery);

    console.log('========================');
    console.log('Search Query:', normalizedQuery);
    console.log('Vector Index:', config.vectorSearchIndex);
    console.log('Embedding Length:', queryEmbedding.length);
    console.log('First 5 values:', queryEmbedding.slice(0, 5));
    console.log('========================');

    const matches = await Chunk.aggregate<SearchMatch>([
      {
        $vectorSearch: {
          index: config.vectorSearchIndex,
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit: 5,
        },
      },
      {
        $project: {
          _id: 0,
          chunkId: { $toString: '$_id' },
          score: { $meta: 'vectorSearchScore' },
          text: 1,
        },
      },
    ]);

    console.log('Matches found:', matches.length);
    console.log('Matches:', matches);
    
    const firstMatch= matches[0];
    if (firstMatch) {
      console.log('First match score:', firstMatch.score);
      console.log(
        'First match text:',
        firstMatch.text?.substring(0, 100),
      );
    }

    return { matches };
  } catch (error) {
    console.error('========================');
    console.error('SEARCH ERROR:');
    console.error(error);
    console.error('========================');

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('Failed to search chunks', 500);
  }
};