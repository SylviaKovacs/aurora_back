import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff
} from '../controllers/staffController.js';

const router = express.Router();

router.get('/', getAllStaff);
router.post('/', auth, isAdmin, createStaff);
router.put('/:id', auth, isAdmin, updateStaff);
router.delete('/:id', auth, isAdmin, deleteStaff);

export default router;
