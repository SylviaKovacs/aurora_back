import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import {
  subscribe,
  getSubscribers,
  deleteSubscriber,
  sendNewsletter,
  getCampaigns
} from '../controllers/newsletterController.js';

const router = express.Router();

router.post('/', subscribe);
router.get('/subscribers', auth, isAdmin, getSubscribers);
router.delete('/subscribers/:id', auth, isAdmin, deleteSubscriber);
router.get('/campaigns', auth, isAdmin, getCampaigns);
router.post('/send', auth, isAdmin, sendNewsletter);

export default router;
