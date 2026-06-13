import { HydratedDocument, Schema, Types, model } from 'mongoose';

export type DocumentStatus = 'PENDING' | 'ACTIVE' | 'ARCHIVED' | 'UPLOADED' | 'EXTRACTED';

export interface DocumentAttributes {
  filename: string;
  originalName: string;
  uploadedBy: Types.ObjectId;
  status: DocumentStatus;
  extractedText?: string;
  textLength?: number;
}

export interface DocumentWithTimestamps extends DocumentAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentHydratedDocument = HydratedDocument<DocumentWithTimestamps>;

const documentSchema = new Schema<DocumentWithTimestamps>(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'ARCHIVED', 'UPLOADED', 'EXTRACTED'],
      default: 'UPLOADED',
      required: true,
    },
    extractedText: {
      type: String,
      default: '',
      trim: true,
    },
    textLength: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Document = model<DocumentWithTimestamps>('Document', documentSchema);

export default Document;