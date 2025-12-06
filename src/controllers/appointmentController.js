import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { userId: req.user.id },
      include: [Service]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Időpontok lekérése sikertelen' });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { appointment_time, serviceId } = req.body;
    if (!appointment_time || !serviceId) {
      return res.status(400).json({ error: 'Időpont és szolgáltatás kötelező' });
    }

    const appointment = await Appointment.create({
      appointment_time,
      serviceId,
      userId: req.user.id,
      status: 'booked'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: 'Időpont létrehozása sikertelen' });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment || appointment.userId !== req.user.id) {
      return res.status(404).json({ error: 'Időpont nem található' });
    }

    await appointment.update(req.body);
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: 'Időpont frissítése sikertelen' });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment || appointment.userId !== req.user.id) {
      return res.status(404).json({ error: 'Időpont nem található' });
    }

    await appointment.destroy();
    res.json({ message: 'Időpont törölve' });
  } catch (error) {
    res.status(500).json({ error: 'Időpont törlése sikertelen' });
  }
};
