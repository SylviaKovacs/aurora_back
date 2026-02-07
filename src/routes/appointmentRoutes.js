
import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import isStaffOrAdmin from '../middleware/isStaffOrAdmin.js';
import {
  getAppointments,
  getAllAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getBookedAppointments,
  getMyAppointments,
  getStaffAppointments,
  updateAppointmentByUser,
  getMyBlockedSlots,
  createBlockedSlot,
  deleteBlockedSlot
} from '../controllers/appointmentController.js';

const router = express.Router();

// Admin - all appointments
router.get('/all', auth, isAdmin, getAllAppointments);
router.get('/mine', auth, getMyAppointments);
router.get('/staff/mine', auth, isStaffOrAdmin, getStaffAppointments);

// Public appointment queries (filtered by date/staff)
router.get('/', getAppointments);
router.get('/booked', getBookedAppointments);
router.get('/blocks/mine', auth, isStaffOrAdmin, getMyBlockedSlots);

// Public booking, admin management
router.post('/', createAppointment);
router.post('/blocks', auth, isStaffOrAdmin, createBlockedSlot);
router.put('/:id/user', auth, updateAppointmentByUser);
router.put('/:id', auth, isAdmin, updateAppointment);
router.put('/:id/status', auth, isAdmin, updateAppointmentStatus);
router.patch('/:id/status', auth, isAdmin, updateAppointmentStatus);
router.delete('/:id', auth, isAdmin, deleteAppointment);
router.delete('/blocks/:id', auth, isStaffOrAdmin, deleteBlockedSlot);

export default router;
