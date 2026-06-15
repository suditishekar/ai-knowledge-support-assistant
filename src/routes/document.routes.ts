import { Router } from 'express';
import { chunkDocument, embedDocument, listDocuments, uploadDocument } from '../controllers/document.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { requireUploadedFile, uploadPdf } from '../middleware/upload.middleware';

const router = Router();

router.get('/', authenticateUser, listDocuments);
router.post('/upload', authenticateUser, authorize('ADMIN'), uploadPdf, requireUploadedFile, uploadDocument);
router.post('/:id/chunk', authenticateUser, authorize('ADMIN'), chunkDocument);
router.post('/:id/chunks', authenticateUser, authorize('ADMIN'), chunkDocument);
router.post('/:id/embed', authenticateUser, authorize('ADMIN'), embedDocument);

export default router;