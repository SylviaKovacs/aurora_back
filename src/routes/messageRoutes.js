
import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import { createMessage, getMessages, updateMessageStatus, deleteMessage } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/', auth, isAdmin, getMessages);
router.patch('/:id/status', auth, isAdmin, updateMessageStatus);
router.delete('/:id', auth, isAdmin, deleteMessage);

export default router;
