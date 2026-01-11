import express from 'express';
import Appointment from '../models/Appointment.js';   // ✅ EZ HIÁNYZOTT!
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getBookedAppointments
} from '../controllers/appointmentController.js';

const router = express.Router();

// ✅ Admin – összes foglalás
router.get('/all', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nem sikerült lekérni a foglalásokat.' });
  }
});

// ✅ Foglalási oldal (szűrt)
router.get('/', getAppointments);

router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.put('/:id/status', updateAppointmentStatus);
router.delete('/:id', deleteAppointment);
router.get('/booked', getBookedAppointments);

export default router;
