import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../controllers/orderController.js';

const router = Router();

router.get('/', auth, getOrders);
router.get('/:id', auth, getOrderById);
router.post('/', auth, createOrder);
router.put('/:id', auth, updateOrder);
router.delete('/:id', auth, deleteOrder);

export default router;
