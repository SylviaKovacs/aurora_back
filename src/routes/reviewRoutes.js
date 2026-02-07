
import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import {
  listReviews,
  listPublicReviews,
  getReviewByAppointment,
  createReview,
  updateReviewStatus,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

router.get('/public', listPublicReviews);
router.get('/appointment/:id', auth, getReviewByAppointment);
router.post('/', auth, createReview);
router.get('/', auth, isAdmin, listReviews);
router.put('/:id/status', auth, isAdmin, updateReviewStatus);
router.delete('/:id', auth, isAdmin, deleteReview);

export default router;
