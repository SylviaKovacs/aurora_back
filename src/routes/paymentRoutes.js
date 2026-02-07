
import express from 'express';
import { startBarionPayment, barionCallback, barionStatus } from '../controllers/paymentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/barion/start', startBarionPayment);
router.post('/barion/callback', barionCallback);
router.get('/barion/status/:id', barionStatus);

export default router;
