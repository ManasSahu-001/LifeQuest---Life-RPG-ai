import { Router } from 'express';
import { RewardController } from '../controllers/rewardController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', RewardController.getRewards);
router.post('/:id/purchase', RewardController.purchaseReward);
router.post('/claims/:claimId', RewardController.claimReward);

export default router;
