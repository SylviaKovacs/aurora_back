import { Router } from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import { getSubscribers, createSubscriber, deleteSubscriber } from '../controllers/newsletterController.js';

const router = Router();

router.get('/', auth, isAdmin, getSubscribers);
router.post('/', createSubscriber);
router.delete('/:id', auth, isAdmin, deleteSubscriber);

export default router;
