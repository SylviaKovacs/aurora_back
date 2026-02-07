
import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import { getAuditLogs } from '../controllers/auditController.js';

const router = express.Router();

router.get('/', auth, isAdmin, getAuditLogs);

export default router;
