import { EmbeddingProvider } from './embedding-provider';
import { OllamaEmbeddingProvider } from './ollama-embedding.provider';

export const createEmbeddingProvider = (): EmbeddingProvider => {
  return new OllamaEmbeddingProvider();
};