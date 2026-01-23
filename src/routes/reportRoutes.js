import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import { getRevenueReport } from '../controllers/reportController.js';

const router = express.Router();

router.get('/revenue', auth, isAdmin, getRevenueReport);

export default router;
