import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} from '../controllers/couponController.js';

const router = express.Router();

router.get('/validate', validateCoupon);
router.get('/', auth, isAdmin, listCoupons);
router.post('/', auth, isAdmin, createCoupon);
router.put('/:id', auth, isAdmin, updateCoupon);
router.delete('/:id', auth, isAdmin, deleteCoupon);

export default router;
