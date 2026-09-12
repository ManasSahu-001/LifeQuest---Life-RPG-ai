import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getShop, purchaseItem, toggleEquipItem } from '../controllers/economyController.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getShop);
router.post('/purchase', purchaseItem);
router.post('/equip', toggleEquipItem);

export default router;
