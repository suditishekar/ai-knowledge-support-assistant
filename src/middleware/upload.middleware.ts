import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
import { AppError } from './error.middleware';

const uploadDirectory = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname) || '.pdf';
    const safeBaseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .toLowerCase();

    cb(null, `${Date.now()}-${safeBaseName}${extension.toLowerCase()}`);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const isPdfMimeType = file.mimetype === 'application/pdf';
  const isPdfExtension = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (!isPdfMimeType || !isPdfExtension) {
    cb(new AppError('Only PDF files are allowed', 400));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadPdf = upload.single('file');

export const requireUploadedFile = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.file) {
    next(new AppError('PDF file is required', 400));
    return;
  }

  next();
};