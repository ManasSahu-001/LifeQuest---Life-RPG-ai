import { Router } from 'express';
import { CharacterController } from '../controllers/characterController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', CharacterController.getCharacter);
router.patch('/', CharacterController.updateCharacter);
router.get('/transactions', CharacterController.getTransactions);

export default router;
