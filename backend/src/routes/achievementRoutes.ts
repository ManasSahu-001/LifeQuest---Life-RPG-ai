import { Router } from 'express';
import { AchievementController } from '../controllers/achievementController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', AchievementController.getAchievements);

export default router;
