import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getOrderItems, createOrderItem, updateOrderItem, deleteOrderItem } from '../controllers/orderItemController.js';

const router = Router();

router.get('/', auth, getOrderItems);
router.post('/', auth, createOrderItem);
router.put('/:id', auth, updateOrderItem);
router.delete('/:id', auth, deleteOrderItem);

export default router;
