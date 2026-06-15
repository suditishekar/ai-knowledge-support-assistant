import { Router } from 'express';
import { chatWithKnowledgeBase } from '../controllers/chat.controller';

const router = Router();

router.post('/', chatWithKnowledgeBase);

export default router;
