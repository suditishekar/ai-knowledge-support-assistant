import { config } from '../../config/env';
import { AppError } from '../../middleware/error.middleware';
import { ChatProvider } from './chat-provider';

interface OllamaChatResponse {
  response?: string;
  error?: string;
}

export class OllamaChatProvider implements ChatProvider {
  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${config.ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.chatModel,
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama responded with status ${response.status}`);
      }

      const data = (await response.json()) as OllamaChatResponse;

      if (typeof data.response !== 'string' || !data.response.trim()) {
        throw new Error(data.error || 'Missing response in Ollama output');
      }

      return data.response.trim();
    } catch {
      throw new AppError('Failed to generate response from Ollama', 502);
    }
  }
}
