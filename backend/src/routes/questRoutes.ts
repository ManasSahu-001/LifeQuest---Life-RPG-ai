import { Router } from 'express';
import { QuestController } from '../controllers/questController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Protect all quest routes with authentication
router.use(requireAuth);

router.post('/', QuestController.createQuest);
router.get('/', QuestController.getQuests);
router.get('/:id', QuestController.getQuestById);
router.patch('/:id', QuestController.updateQuest);
router.delete('/:id', QuestController.deleteQuest);
router.post('/:id/complete', QuestController.completeQuest);

export default router;
