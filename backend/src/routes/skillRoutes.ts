import { Router } from 'express';
import { SkillController } from '../controllers/skillController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', SkillController.getSkills);
router.post('/:id/unlock', SkillController.unlockSkill);

export default router;
