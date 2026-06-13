import { Router } from 'express';
import { authTest, login, profile, register } from '../controllers/auth.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateUser, profile);
router.get('/test', authenticateUser, authorize('ADMIN'), authTest);

export default router;