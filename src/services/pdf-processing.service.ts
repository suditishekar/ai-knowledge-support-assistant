import { readFile } from 'fs/promises';
import { PDFParse } from 'pdf-parse';
import { AppError } from '../middleware/error.middleware';

interface PdfExtractionResult {
  extractedText: string;
  textLength: number;
}

export const extractTextFromPdf = async (filePath: string): Promise<PdfExtractionResult> => {
  let parser: PDFParse | null = null;

  try {
    const fileBuffer = await readFile(filePath);
    parser = new PDFParse({ data: fileBuffer });
    const parsedPdf = await parser.getText();
    const extractedText = parsedPdf.text?.trim() ?? '';

    return {
      extractedText,
      textLength: extractedText.length,
    };
  } catch {
    throw new AppError('Failed to extract text from PDF', 500);
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};