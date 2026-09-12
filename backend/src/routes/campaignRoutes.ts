import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { campaignRateLimiter } from '../middleware/rateLimiter.js';
import {
  listCampaigns,
  generateCampaign,
  getActiveCampaignBoss,
} from '../controllers/campaignController.js';

const router = Router();

router.use(authenticateToken);

router.get('/', listCampaigns);
router.post('/generate', campaignRateLimiter, generateCampaign);
router.get('/active-boss', getActiveCampaignBoss);

export default router;
