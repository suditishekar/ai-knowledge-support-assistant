import { Router } from 'express';
import { listDocuments, uploadDocument } from '../controllers/document.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { requireUploadedFile, uploadPdf } from '../middleware/upload.middleware';

const router = Router();

router.get('/', authenticateUser, listDocuments);
router.post('/upload', authenticateUser, authorize('ADMIN'), uploadPdf, requireUploadedFile, uploadDocument);

export default router;