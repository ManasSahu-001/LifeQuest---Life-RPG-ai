import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getCity, constructBuilding } from '../controllers/cityController.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getCity);
router.post('/construct', constructBuilding);

export default router;
