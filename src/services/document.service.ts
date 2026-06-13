import { Types } from 'mongoose';
import { Document } from '../models/document.model';
import { extractTextFromPdf } from './pdf-processing.service';
import { AppError } from '../middleware/error.middleware';

export const getAllDocuments = async () => {
  return Document.find().sort({ createdAt: -1 }).populate('uploadedBy', 'name email role');
};

interface UploadDocumentInput {
  filename: string;
  originalName: string;
  uploadedBy: string;
  filePath: string;
}

export const createDocumentMetadata = async (input: UploadDocumentInput): Promise<string> => {
  const document = await Document.create({
    filename: input.filename,
    originalName: input.originalName,
    uploadedBy: new Types.ObjectId(input.uploadedBy),
    status: 'UPLOADED',
  });

  try {
    const extractionResult = await extractTextFromPdf(input.filePath);

    document.extractedText = extractionResult.extractedText;
    document.textLength = extractionResult.textLength;
    document.status = 'EXTRACTED';

    await document.save();
  } catch {
    throw new AppError('Document uploaded but text extraction failed', 500);
  }

  return document._id.toString();
};