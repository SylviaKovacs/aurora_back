import { Router } from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import { getUsers, getMe, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

router.get('/me', auth, getMe);

router.get('/', auth, isAdmin, getUsers);

router.get('/:id', auth, isAdmin, getUserById);

router.put('/:id', auth, updateUser);

router.delete('/:id', auth, isAdmin, deleteUser);

export default router;
