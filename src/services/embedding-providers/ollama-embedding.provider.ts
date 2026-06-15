import { config } from '../../config/env';
import { AppError } from '../../middleware/error.middleware';
import { EmbeddingProvider } from './embedding-provider';

interface OllamaEmbeddingResponse {
  embedding?: number[];
  error?: string;
}

export class OllamaEmbeddingProvider implements EmbeddingProvider {
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${config.ollamaBaseUrl}/api/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.embeddingModel,
          prompt: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama responded with status ${response.status}`);
      }

      const data = (await response.json()) as OllamaEmbeddingResponse;

      if (!Array.isArray(data.embedding)) {
        throw new Error(data.error || 'Missing embedding in Ollama response');
      }

      return data.embedding;
    } catch {
      throw new AppError('Failed to generate embedding from Ollama', 502);
    }
  }
}