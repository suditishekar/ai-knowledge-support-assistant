import { HydratedDocument, Schema, Types, model } from 'mongoose';

export interface ChunkAttributes {
  documentId: Types.ObjectId;
  chunkIndex: number;
  text: string;
  tokenCount: number;
  embedding?: number[];
}

export interface ChunkWithTimestamps extends ChunkAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export type ChunkHydratedDocument = HydratedDocument<ChunkWithTimestamps>;

const chunkSchema = new Schema<ChunkWithTimestamps>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    tokenCount: {
      type: Number,
      required: true,
      min: 0,
    },
    embedding: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

chunkSchema.index({ documentId: 1, chunkIndex: 1 }, { unique: true });

export const Chunk = model<ChunkWithTimestamps>('Chunk', chunkSchema);

export default Chunk;