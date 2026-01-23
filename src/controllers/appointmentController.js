import Appointment from '../models/Appointment.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Staff from '../models/Staff.js';
import BlockedSlot from '../models/BlockedSlot.js';
import AuditLog from '../models/AuditLog.js';
import { Op } from 'sequelize';
import {
  notifyAppointmentCreated,
  notifyAppointmentUpdated,
  notifyAppointmentStatus
} from '../utils/notifications.js';
import { applyCouponToPrice, incrementCouponUsage } from './couponController.js';

const getOptionalUserFromRequest = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    return user || null;
  } catch {
    return null;
  }
};

const getPreviousSundayEnd = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = date.getDay();
  const diff = day === 0 ? 0 : day;
  const previousSunday = new Date(date);
  previousSunday.setDate(date.getDate() - diff);
  previousSunday.setHours(23, 59, 59, 999);
  return previousSunday;
};

const canUserModifyAppointment = (appointmentDate) => {
  const cutoff = getPreviousSundayEnd(appointmentDate);
  return new Date() <= cutoff;
};

const expandTimes = (timeStr, durationMinutes) => {
  const start = convertToMinutes(timeStr);
  if (!Number.isFinite(start)) return [];
  const duration = Number(durationMinutes) || 0;
  if (!Number.isFinite(duration) || duration <= 0) return [];
  const step = 15;
  const times = [];
  for (let t = start; t < start + duration; t += step) {
    times.push(minutesToTimeString(t));
  }
  return times;
};

const logAction = async (req, action, entityType, entityId, metadata) => {
  try {
    await AuditLog.create({
      actorUserId: req.user?.id ?? null,
      actorRole: req.user?.role ?? null,
      action,
      entityType,
      entityId,
      metadata
    });
  } catch {}
};

export const getAllAppointments = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      status,
      service,
      staff,
      date,
      all
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (service) where.serviceLabel = service;
    if (staff) where.staffName = staff;
    if (date) where.date = date;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const computeTotalRevenue = async () => {
      const rows = await Appointment.findAll({
        where,
        attributes: ['price', 'finalPrice', 'depositAmount', 'paidAmount', 'status']
      });
      return rows.reduce((sum, a) => {
        if (a.status === 'cancelled') return sum;
        const price = Number(a.finalPrice) || Number(a.price) || 0;
        const paid = Number(a.paidAmount);
        const deposit = Number(a.depositAmount);
        const revenue = Number.isFinite(paid) ? paid : (Number.isFinite(deposit) ? deposit : price);
        return sum + revenue;
      }, 0);
    };

    if (all === 'true') {
      const appointments = await Appointment.findAll({
        where,
        order: [['date', 'ASC'], ['time', 'ASC']]
      });
      const totalRevenue = await computeTotalRevenue();
      return res.json({ items: appointments, total: appointments.length, totalRevenue });
    }

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Number(limit) || 50, 200);
    const offset = (pageNum - 1) * limitNum;

    const result = await Appointment.findAndCountAll({
      where,
      order: [['date', 'ASC'], ['time', 'ASC']],
      limit: limitNum,
      offset
    });

    res.json({
      items: result.rows,
      total: result.count,
      totalRevenue: await computeTotalRevenue()
    });
  } catch (error) {
    res.status(500).json({ error: 'Idopontok lekerese sikertelen' });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { date, staffId } = req.query;

    if (date && staffId) {
      const appointments = await Appointment.findAll({
        where: { date, staffId },
        order: [['time', 'ASC']]
      });
      const blocks = await BlockedSlot.findAll({
        where: { date, staffId },
        order: [['time', 'ASC']]
      });
      const expanded = [];
      appointments.forEach((a) => {
        const times = expandTimes(a.time, a.durationMinutes);
        times.forEach((t) => expanded.push({ id: a.id, time: t }));
      });
      blocks.forEach((b) => {
        const times = expandTimes(b.time, b.durationMinutes);
        times.forEach((t) => expanded.push({ id: `block-${b.id}`, time: t }));
      });
      return res.json(expanded);
    }

    const appointments = await Appointment.findAll({
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Idopontok lekerese sikertelen' });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      serviceKey,
      serviceLabel,
      price,
      durationMinutes,
      date,
      time,
      staffId,
      staffName,
      couponCode,
      paymentMethod,
      depositAmount
    } = req.body;

    const authUser = await getOptionalUserFromRequest(req);

    const resolvedName = name || authUser?.name;
    const resolvedEmail = email || authUser?.email;
    const resolvedPhone = phone || authUser?.phone;

    if (
      !resolvedName ||
      !resolvedEmail ||
      !resolvedPhone ||
      !serviceKey ||
      !serviceLabel ||
      !durationMinutes ||
      !date ||
      !time
    ) {
      return res.status(400).json({ error: 'Minden mezo kotelezo!' });
    }

    const duration = Number(durationMinutes);
    if (!Number.isFinite(duration) || duration <= 0) {
      return res.status(400).json({ error: 'Ervenytelen idotartam' });
    }

    const startMinutes = convertToMinutes(time);
    if (!Number.isFinite(startMinutes)) {
      return res.status(400).json({ error: 'Ervenytelen idopont' });
    }
    const endMinutes = startMinutes + duration;

    const existingAppointments = await Appointment.findAll({
      where: { date, staffId: staffId ?? null }
    });
    const blockedSlots = await BlockedSlot.findAll({
      where: { date, staffId: staffId ?? null }
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
    const hasBlockedConflict = blockedSlots.some(b => {
      const bStart = convertToMinutes(b.time);
      const bEnd = bStart + b.durationMinutes;
      return (
        (startMinutes >= bStart && startMinutes < bEnd) ||
        (endMinutes > bStart && endMinutes <= bEnd) ||
        (startMinutes <= bStart && endMinutes >= bEnd)
      );
    });

    if (hasConflict || hasBlockedConflict) {
      return res.status(400).json({ error: 'Ez az idopont mar foglalt!' });
    }

    const basePrice = Number(price) || 0;
    const couponResult = await applyCouponToPrice(couponCode, basePrice);
    const discountAmount = couponResult.discount || 0;
    const finalPrice = Number.isFinite(couponResult.finalPrice) ? couponResult.finalPrice : basePrice;

    const safeDeposit = depositAmount !== undefined && depositAmount !== null
      ? Math.max(0, Number(depositAmount) || 0)
      : null;

    const appointment = await Appointment.create({
      name: resolvedName,
      email: resolvedEmail,
      phone: resolvedPhone,
      serviceKey,
      serviceLabel,
      price: basePrice || null,
      couponCode: couponResult.coupon?.code || null,
      discountAmount: discountAmount || null,
      finalPrice: Number.isFinite(finalPrice) ? finalPrice : null,
      durationMinutes: duration,
      date,
      time,
      staffId: staffId ?? null,
      staffName: staffName || 'Nincs megadva',
      status: 'pending',
      userId: authUser?.id ?? null,
      paymentMethod: paymentMethod || null,
      depositAmount: safeDeposit,
      paymentStatus: paymentMethod ? 'pending' : 'unpaid'
    });

    if (couponResult.coupon) {
      await incrementCouponUsage(couponResult.coupon.id);
    }

    await logAction(req, 'appointment_create', 'Appointment', appointment.id, {
      date,
      time,
      staffId: staffId ?? null,
      serviceKey
    });
    await notifyAppointmentCreated(appointment);
    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Idopont letrehozasa sikertelen' });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Felhasznalo nem talalhato' });
    }

    const conditions = [];
    if (user.id) conditions.push({ userId: user.id });
    if (user.email) conditions.push({ email: user.email });

    const appointments = await Appointment.findAll({
      where: conditions.length ? { [Op.or]: conditions } : {},
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Idopontok lekerese sikertelen' });
  }
};

export const getStaffAppointments = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Felhasznalo nem talalhato' });
    }

    let staff = await Staff.findOne({ where: { userId: user.id } });
    const where = {};

    if (staff) {
      where.staffId = staff.id;
    } else {
      return res.status(400).json({ error: 'Nincs hozzarendelt szakember' });
    }

    const appointments = await Appointment.findAll({
      where,
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    res.json({
      staff: staff ? { id: staff.id, name: staff.name } : { name: user.name },
      appointments
    });
  } catch (error) {
    res.status(500).json({ error: 'Idopontok lekerese sikertelen' });
  }
};

export const updateAppointmentByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ error: 'Datum es idopont kotelezo' });
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Idopont nem talalhato' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Felhasznalo nem talalhato' });
    }

    const isOwner = (appointment.userId && appointment.userId === user.id) ||
      (appointment.email && appointment.email === user.email);

    if (!isOwner) {
      return res.status(403).json({ error: 'Nincs jogosultsag' });
    }

    if (!canUserModifyAppointment(appointment.date)) {
      return res.status(400).json({ error: 'Modositas csak az idopont elotti vasarnapig lehetseges' });
    }

    const startMinutes = convertToMinutes(time);
    if (!Number.isFinite(startMinutes)) {
      return res.status(400).json({ error: 'Ervenytelen idopont' });
    }
    const endMinutes = startMinutes + appointment.durationMinutes;

    const existingAppointments = await Appointment.findAll({
      where: { date, staffId: appointment.staffId ?? null }
    });
    const blockedSlots = await BlockedSlot.findAll({
      where: { date, staffId: appointment.staffId ?? null }
    });

    const hasConflict = existingAppointments.some(a => {
      if (a.id === appointment.id) return false;
      const aStart = convertToMinutes(a.time);
      const aEnd = aStart + a.durationMinutes;
      return (
        (startMinutes >= aStart && startMinutes < aEnd) ||
        (endMinutes > aStart && endMinutes <= aEnd) ||
        (startMinutes <= aStart && endMinutes >= aEnd)
      );
    });
    const hasBlockedConflict = blockedSlots.some(b => {
      const bStart = convertToMinutes(b.time);
      const bEnd = bStart + b.durationMinutes;
      return (
        (startMinutes >= bStart && startMinutes < bEnd) ||
        (endMinutes > bStart && endMinutes <= bEnd) ||
        (startMinutes <= bStart && endMinutes >= bEnd)
      );
    });

    if (hasConflict || hasBlockedConflict) {
      return res.status(400).json({ error: 'Ez az idopont mar foglalt!' });
    }

    await appointment.update({ date, time });
    await logAction(req, 'appointment_update_user', 'Appointment', appointment.id, {
      date,
      time
    });
    await notifyAppointmentUpdated(appointment);
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: 'Idopont frissitese sikertelen' });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Idopont nem talalhato' });
    }

    const { date, time, staffId, depositAmount, paidAmount, paymentMethod } = req.body;
    if ((date && !time) || (!date && time)) {
      return res.status(400).json({ error: 'Datum es idopont kotelezo' });
    }

    if (depositAmount !== undefined && depositAmount !== null && Number(depositAmount) < 0) {
      return res.status(400).json({ error: 'Eloleg nem lehet negativ' });
    }
    if (paidAmount !== undefined && paidAmount !== null && Number(paidAmount) < 0) {
      return res.status(400).json({ error: 'Fizetett osszeg nem lehet negativ' });
    }

    if (staffId !== undefined) {
      if (staffId === null) {
        req.body.staffName = 'Nincs megadva';
      } else {
        const staff = await Staff.findByPk(staffId);
        if (staff) {
          req.body.staffName = staff.name;
        }
      }
    }

    if (date && time) {
      const startMinutes = convertToMinutes(time);
      if (!Number.isFinite(startMinutes)) {
        return res.status(400).json({ error: 'Ervenytelen idopont' });
      }
      const duration = appointment.durationMinutes;
      const endMinutes = startMinutes + duration;
      const effectiveStaffId = staffId !== undefined ? staffId : appointment.staffId;

      const existingAppointments = await Appointment.findAll({
        where: { date, staffId: effectiveStaffId ?? null }
      });
      const blockedSlots = await BlockedSlot.findAll({
        where: { date, staffId: effectiveStaffId ?? null }
      });

      const hasConflict = existingAppointments.some(a => {
        if (a.id === appointment.id) return false;
        const aStart = convertToMinutes(a.time);
        const aEnd = aStart + a.durationMinutes;
        return (
          (startMinutes >= aStart && startMinutes < aEnd) ||
          (endMinutes > aStart && endMinutes <= aEnd) ||
          (startMinutes <= aStart && endMinutes >= aEnd)
        );
      });
      const hasBlockedConflict = blockedSlots.some(b => {
        const bStart = convertToMinutes(b.time);
        const bEnd = bStart + b.durationMinutes;
        return (
          (startMinutes >= bStart && startMinutes < bEnd) ||
          (endMinutes > bStart && endMinutes <= bEnd) ||
          (startMinutes <= bStart && endMinutes >= bEnd)
        );
      });

      if (hasConflict || hasBlockedConflict) {
        return res.status(400).json({ error: 'Ez az idopont mar foglalt!' });
      }
    }

    await appointment.update(req.body);
    await logAction(req, 'appointment_update_admin', 'Appointment', appointment.id, {
      date: req.body.date ?? appointment.date,
      time: req.body.time ?? appointment.time,
      staffId: req.body.staffId ?? appointment.staffId,
      status: req.body.status ?? appointment.status,
      depositAmount: req.body.depositAmount ?? appointment.depositAmount,
      paidAmount: req.body.paidAmount ?? appointment.paidAmount,
      paymentMethod: req.body.paymentMethod ?? appointment.paymentMethod
    });
    await notifyAppointmentUpdated(appointment);
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: 'Idopont frissitese sikertelen' });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Idopont nem talalhato' });
    }

    appointment.status = status;
    await appointment.save();
    await logAction(req, 'appointment_status_update', 'Appointment', appointment.id, {
      status
    });
    await notifyAppointmentStatus(appointment);

    res.json({ message: 'Statusz frissitve', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Statusz frissitese sikertelen' });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Idopont nem talalhato' });
    }

    await appointment.destroy();
    await logAction(req, 'appointment_delete', 'Appointment', appointment.id, {
      date: appointment.date,
      time: appointment.time,
      staffId: appointment.staffId ?? null
    });
    res.json({ message: 'Idopont torolve' });
  } catch (error) {
    res.status(500).json({ error: 'Idopont torlese sikertelen' });
  }
};

function convertToMinutes(timeStr) {
  if (typeof timeStr !== 'string' || !timeStr.includes(':')) return NaN;
  const [h, m] = timeStr.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
  return h * 60 + m;
}

function minutesToTimeString(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export const getBookedAppointments = async (req, res) => {
  try {
    const { date, staffId } = req.query;

    if (!date || !staffId) {
      return res.status(400).json({ error: 'Datum es szakember ID kotelezo!' });
    }

    const appointments = await Appointment.findAll({
      where: { date, staffId },
      attributes: ['id', 'time', 'durationMinutes']
    });
    const blocks = await BlockedSlot.findAll({
      where: { date, staffId },
      attributes: ['id', 'time', 'durationMinutes']
    });

    const expanded = [];
    appointments.forEach((a) => {
      const times = expandTimes(a.time, a.durationMinutes);
      times.forEach((t) => expanded.push({ id: a.id, time: t }));
    });
    blocks.forEach((b) => {
      const times = expandTimes(b.time, b.durationMinutes);
      times.forEach((t) => expanded.push({ id: `block-${b.id}`, time: t }));
    });
    res.json(expanded);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Foglalasok lekerese sikertelen' });
  }
};

export const getMyBlockedSlots = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Felhasznalo nem talalhato' });
    }

    const staff = await Staff.findOne({ where: { userId: user.id } });
    const staffId = staff?.id || null;
    if (!staffId) {
      return res.status(400).json({ error: 'Nincs hozzarendelt szakember' });
    }

    const blocks = await BlockedSlot.findAll({
      where: { staffId },
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json({ staff: { id: staffId, name: staff?.name }, blocks });
  } catch (error) {
    res.status(500).json({ error: 'Zarolasok lekerese sikertelen' });
  }
};

export const createBlockedSlot = async (req, res) => {
  try {
    const { date, time, durationMinutes, note, staffId: bodyStaffId } = req.body;
    if (!date || !time || !durationMinutes) {
      return res.status(400).json({ error: 'Datum, idopont es idotartam kotelezo' });
    }

    const duration = Number(durationMinutes);
    if (!Number.isFinite(duration) || duration <= 0) {
      return res.status(400).json({ error: 'Ervenytelen idotartam' });
    }

    const startMinutes = convertToMinutes(time);
    if (!Number.isFinite(startMinutes)) {
      return res.status(400).json({ error: 'Ervenytelen idopont' });
    }
    const endMinutes = startMinutes + duration;

    let staffId = bodyStaffId ?? null;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Felhasznalo nem talalhato' });
    }
    if (!staffId) {
      const staff = await Staff.findOne({ where: { userId: user.id } });
      staffId = staff?.id ?? null;
    }
    if (!staffId) {
      return res.status(400).json({ error: 'Nincs hozzarendelt szakember' });
    }

    const existingAppointments = await Appointment.findAll({
      where: { date, staffId }
    });
    const blockedSlots = await BlockedSlot.findAll({
      where: { date, staffId }
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
    const hasBlockedConflict = blockedSlots.some(b => {
      const bStart = convertToMinutes(b.time);
      const bEnd = bStart + b.durationMinutes;
      return (
        (startMinutes >= bStart && startMinutes < bEnd) ||
        (endMinutes > bStart && endMinutes <= bEnd) ||
        (startMinutes <= bStart && endMinutes >= bEnd)
      );
    });

    if (hasConflict || hasBlockedConflict) {
      return res.status(400).json({ error: 'Ez az idosav mar foglalt vagy zarolt.' });
    }

    const block = await BlockedSlot.create({
      staffId,
      date,
      time,
      durationMinutes: duration,
      note: note || null
    });

    await logAction(req, 'blockedslot_create', 'BlockedSlot', block.id, {
      date,
      time,
      durationMinutes: duration,
      staffId
    });
    res.status(201).json(block);
  } catch (error) {
    res.status(400).json({ error: 'Zarolas letrehozasa sikertelen' });
  }
};

export const deleteBlockedSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const block = await BlockedSlot.findByPk(id);
    if (!block) {
      return res.status(404).json({ error: 'Zarolas nem talalhato' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Felhasznalo nem talalhato' });
    }

    if (user.role !== 'admin') {
      const staff = await Staff.findOne({ where: { userId: user.id } });
      if (!staff || staff.id !== block.staffId) {
        return res.status(403).json({ error: 'Nincs jogosultsag' });
      }
    }

    await block.destroy();
    await logAction(req, 'blockedslot_delete', 'BlockedSlot', block.id, {});
    res.json({ message: 'Zarolas torolve' });
  } catch (error) {
    res.status(500).json({ error: 'Zarolas torlese sikertelen' });
  }
};
