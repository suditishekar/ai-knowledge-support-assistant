import { Router } from 'express';
import { chatWithKnowledgeBase, getChatHistory } from '../controllers/chat.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateUser);

router.post('/', chatWithKnowledgeBase);
router.get('/history', getChatHistory);

export default router;
