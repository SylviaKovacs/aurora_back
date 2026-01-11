import Appointment from '../models/Appointment.js';

// ✅ Admin: összes foglalás lekérése
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Időpontok lekérése sikertelen' });
  }
};

// ✅ Új foglalás létrehozása (vendég is foglalhat)
export const createAppointment = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      serviceKey,
      serviceLabel,
      durationMinutes,
      date,
      time,
      staffName // ✅ ÚJ: szakember neve
    } = req.body;

    // ✅ Kötelező mezők ellenőrzése
    if (
      !name ||
      !email ||
      !phone ||
      !serviceKey ||
      !serviceLabel ||
      !durationMinutes ||
      !date ||
      !time
    ) {
      return res.status(400).json({ error: 'Minden mező kötelező!' });
    }

    // ✅ Ütközésvizsgálat (időintervallum)
    const startMinutes = convertToMinutes(time);
    const endMinutes = startMinutes + durationMinutes;

    const existingAppointments = await Appointment.findAll({
      where: { date }
    });

    const hasConflict = existingAppointments.some(a => {
      const aStart = convertToMinutes(a.time);
      const aEnd = aStart + a.durationMinutes;

      return (
        (startMinutes >= aStart && startMinutes < aEnd) || 
        (endMinutes > aStart && endMinutes <= aEnd) ||     
        (startMinutes <= aStart && endMinutes >= aEnd)     
      );
    });

    if (hasConflict) {
      return res.status(400).json({ error: 'Ez az időpont már foglalt!' });
    }

    // ✅ Foglalás mentése (staffName is megy!)
    const appointment = await Appointment.create({
      name,
      email,
      phone,
      serviceKey,
      serviceLabel,
      durationMinutes,
      date,
      time,
      staffName: staffName || 'Nincs megadva', // ✅ ha nincs küldve, akkor default
      status: 'pending'
    });

    res.status(201).json(appointment);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Időpont létrehozása sikertelen' });
  }
};

// ✅ Foglalás frissítése (admin)
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Időpont nem található' });
    }

    await appointment.update(req.body);
    res.json(appointment);

  } catch (error) {
    res.status(400).json({ error: 'Időpont frissítése sikertelen' });
  }
};

// ✅ Státusz frissítése (admin)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Időpont nem található' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Státusz frissítve', appointment });

  } catch (error) {
    res.status(500).json({ error: 'Státusz frissítése sikertelen' });
  }
};

// ✅ Foglalás törlése (admin)
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Időpont nem található' });
    }

    await appointment.destroy();
    res.json({ message: 'Időpont törölve' });

  } catch (error) {
    res.status(500).json({ error: 'Időpont törlése sikertelen' });
  }
};

// ✅ Segédfüggvény: "10:30" → 630 perc
function convertToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}
export const getBookedAppointments = async (req, res) => {
  try {
    const { date, staffId } = req.query;

    if (!date || !staffId) {
      return res.status(400).json({ error: 'Dátum és szakember ID kötelező!' });
    }

    const appointments = await Appointment.findAll({
      where: { date, staffId },
      attributes: ['time']
    });

    res.json(appointments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Foglalások lekérése sikertelen' });
  }
};
