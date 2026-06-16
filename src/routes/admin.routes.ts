import { Router } from 'express';
import { getActivity, getStats } from '../controllers/admin.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(authenticateUser, authorize('ADMIN'));

router.get('/stats', getStats);
router.get('/activity', getActivity);

export default router;