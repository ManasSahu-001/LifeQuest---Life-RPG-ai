import { Router } from 'express';
import { BossController } from '../controllers/bossController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', BossController.getActiveBoss);
router.post('/attack', BossController.attackBoss);

export default router;
