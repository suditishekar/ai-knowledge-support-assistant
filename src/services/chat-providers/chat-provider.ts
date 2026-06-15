export interface ChatProvider {
  generateResponse(prompt: string): Promise<string>;
}
