import { Router } from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import { getServices, getServiceById, createService, updateService, deleteService } from '../controllers/serviceController.js';

const router = Router();

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', auth, isAdmin, createService);
router.put('/:id', auth, isAdmin, updateService);
router.delete('/:id', auth, isAdmin, deleteService);

export default router;
