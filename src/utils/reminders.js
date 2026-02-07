
import { Op } from 'sequelize';
import Appointment from '../models/Appointment.js';
import AuditLog from '../models/AuditLog.js';
import { notifyAppointmentReminder } from './notifications.js';

const formatDateOnly = (date) => date.toISOString().slice(0, 10);

const getAppointmentDateTime = (appointment) => {
  if (!appointment?.date || !appointment?.time) return null;
  const dt = new Date(`${appointment.date}T${appointment.time}:00`);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
};

const shouldSendReminder = (appointment, startWindow, endWindow) => {
  if (!appointment || appointment.status === 'cancelled') return false;
  const dt = getAppointmentDateTime(appointment);
  if (!dt) return false;
  return dt >= startWindow && dt <= endWindow;
};

// Export: startReminderScheduler
export const startReminderScheduler = () => {
  const enabled = (process.env.REMINDER_ENABLED || 'true').toLowerCase() === 'true';
  if (!enabled) return;

  const offsetHours = Number(process.env.REMINDER_OFFSET_HOURS || 24);
  const windowMinutes = Number(process.env.REMINDER_WINDOW_MINUTES || 15);
  const intervalMinutes = Number(process.env.REMINDER_INTERVAL_MINUTES || 5);

  const run = async () => {
    try {
      const now = new Date();
      const startWindow = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);
      const endWindow = new Date(startWindow.getTime() + windowMinutes * 60 * 1000);

      const dateFrom = formatDateOnly(startWindow);
      const dateTo = formatDateOnly(endWindow);

      const appointments = await Appointment.findAll({
        where: {
          date: { [Op.between]: [dateFrom, dateTo] }
        }
      });

      if (!appointments.length) return;

      const candidates = appointments.filter((a) => shouldSendReminder(a, startWindow, endWindow));
      if (!candidates.length) return;

      const ids = candidates.map((a) => a.id);
      const existing = await AuditLog.findAll({
        where: {
          action: 'appointment_reminder',
          entityType: 'Appointment',
          entityId: { [Op.in]: ids }
        }
      });
      const sentSet = new Set(existing.map((e) => e.entityId));

      for (const appointment of candidates) {
        if (sentSet.has(appointment.id)) continue;
        if (!appointment.email) continue;
        await notifyAppointmentReminder(appointment);
        await AuditLog.create({
          actorUserId: null,
          actorRole: 'system',
          action: 'appointment_reminder',
          entityType: 'Appointment',
          entityId: appointment.id,
          metadata: { offsetHours }
        });
      }
    } catch {
      // ignore scheduler errors
    }
  };

  run();
  setInterval(run, intervalMinutes * 60 * 1000);
};
