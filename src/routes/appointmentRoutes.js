import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js';

const router = Router();

router.get('/', auth, getAppointments);
router.post('/', auth, createAppointment);
router.put('/:id', auth, updateAppointment);
router.delete('/:id', auth, deleteAppointment);

export default router;
