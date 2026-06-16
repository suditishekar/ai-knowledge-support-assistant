import { HydratedDocument, Schema, Types, model } from 'mongoose';

export interface ConversationAttributes {
  userId: Types.ObjectId;
  question: string;
  answer: string;
  sourceChunkIds: Types.ObjectId[];
}

export interface ConversationWithTimestamps extends ConversationAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export type ConversationHydratedDocument = HydratedDocument<ConversationWithTimestamps>;

const conversationSchema = new Schema<ConversationWithTimestamps>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    sourceChunkIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Chunk',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({ userId: 1, createdAt: -1 });

export const Conversation = model<ConversationWithTimestamps>('Conversation', conversationSchema);

export default Conversation;