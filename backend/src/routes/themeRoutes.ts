import { Router } from 'express';
import { ThemeController } from '../controllers/themeController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.patch('/', ThemeController.updateTheme);

export default router;
