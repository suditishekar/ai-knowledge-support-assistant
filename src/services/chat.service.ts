import { Types } from 'mongoose';
import { AppError } from '../middleware/error.middleware';
import { createChatProvider } from './chat-providers/chat-provider.factory';
import { createConversation } from './conversation.service';
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
  userId: string,
): Promise<ChatAnswerResult> => {
  const normalizedQuestion = question.trim();

  if (!normalizedQuestion) {
    throw new AppError('Question is required', 400);
  }

  const searchResult = await searchChunksByQuery(normalizedQuestion);
  const topMatches = searchResult.matches.slice(0, 5);
  const topChunks = topMatches.map((match) => match.text.trim()).filter(Boolean);
  const sourceChunkIds = topMatches.map((match) => new Types.ObjectId(match.chunkId));

  if (topChunks.length === 0) {
    await createConversation({
      userId,
      question: normalizedQuestion,
      answer: NO_ANSWER_MESSAGE,
      sourceChunkIds: [],
    });

    return { answer: NO_ANSWER_MESSAGE };
  }

  const prompt = buildPrompt(normalizedQuestion, topChunks);
  const answer = await chatProvider.generateResponse(prompt);

  await createConversation({
    userId,
    question: normalizedQuestion,
    answer,
    sourceChunkIds,
  });

  return { answer };
};
