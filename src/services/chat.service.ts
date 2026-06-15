import { AppError } from '../middleware/error.middleware';
import { createChatProvider } from './chat-providers/chat-provider.factory';
import { searchChunksByQuery } from './search.service';

export interface ChatAnswerResult {
  answer: string;
}

const NO_ANSWER_MESSAGE =
  'I could not find that information in the uploaded documents.';

const chatProvider = createChatProvider();

const buildPrompt = (question: string, contextChunks: string[]): string => {
  const context = contextChunks.join('\n\n');

  return [
    'You are a support knowledge assistant.',
    '',
    'Answer ONLY using the provided context.',
    '',
    'If the answer cannot be found in the context, say:',
    '"I could not find that information in the uploaded documents."',
    '',
    'Context:',
    context,
    '',
    'Question:',
    question,
  ].join('\n');
};

export const generateChatAnswer = async (
  question: string,
): Promise<ChatAnswerResult> => {
  const normalizedQuestion = question.trim();

  if (!normalizedQuestion) {
    throw new AppError('Question is required', 400);
  }

  const searchResult = await searchChunksByQuery(normalizedQuestion);
  const topChunks = searchResult.matches.slice(0, 5).map((match) => match.text.trim()).filter(Boolean);

  if (topChunks.length === 0) {
    return { answer: NO_ANSWER_MESSAGE };
  }

  const prompt = buildPrompt(normalizedQuestion, topChunks);
  const answer = await chatProvider.generateResponse(prompt);

  return { answer };
};
