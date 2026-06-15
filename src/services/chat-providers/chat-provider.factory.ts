import { ChatProvider } from './chat-provider';
import { OllamaChatProvider } from './ollama-chat.provider';

export const createChatProvider = (): ChatProvider => {
  return new OllamaChatProvider();
};
