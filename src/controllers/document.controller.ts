import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/error.middleware';
import { createDocumentMetadata, getAllDocuments } from '../services/document.service';

export const listDocuments = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const documents = await getAllDocuments();

  res.status(200).json({
    success: true,
    data: documents,
  });
});

export const uploadDocument = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  if (!req.file) {
    throw new AppError('PDF file is required', 400);
  }

  const documentId = await createDocumentMetadata({
    filename: req.file.filename,
    originalName: req.file.originalname,
    uploadedBy: req.user.userId,
    filePath: req.file.path,
  });

  res.status(201).json({
    success: true,
    documentId,
  });
});