import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  listCampaigns,
  generateCampaign,
  getActiveCampaignBoss,
} from '../controllers/campaignController.js';

const router = Router();

router.use(authenticateToken);

router.get('/', listCampaigns);
router.post('/generate', generateCampaign);
router.get('/active-boss', getActiveCampaignBoss);

export default router;
