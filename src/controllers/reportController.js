
import Appointment from '../models/Appointment.js';
import { Op } from 'sequelize';

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeAmount = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const cleaned = value
    .toString()
    .replace(/[^\d,.-]/g, '')
    .replace(/\s+/g, '')
    .replace(',', '.');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

const computeRevenue = (a) => {
  const status = (a.status || 'pending').toLowerCase();
  if (status === 'cancelled') return 0;
  const price = normalizeAmount(a.finalPrice) ?? normalizeAmount(a.price) ?? 0;
  const paid = normalizeAmount(a.paidAmount);
  const deposit = normalizeAmount(a.depositAmount);
  if (Number.isFinite(paid) && paid > 0) return paid;
  if (Number.isFinite(deposit) && deposit > 0) return deposit;
  const method = (a.paymentMethod || 'onsite').toLowerCase();
  if (method === 'onsite' && (status === 'confirmed' || status === 'completed')) {
    return price;
  }
  return 0;
};

export const getRevenueReport = async (req, res) => {
  try {
    const { month } = req.query;
    let dateFilter = {};
    if (typeof month === 'string' && /^\d{4}-\d{2}$/.test(month)) {
      const [y, m] = month.split('-').map(Number);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 1);
      const startStr = start.toISOString().slice(0, 10);
      const endStr = end.toISOString().slice(0, 10);
      dateFilter = { date: { [Op.gte]: startStr, [Op.lt]: endStr } };
    }

    const appointments = await Appointment.findAll({
      attributes: [
        'id',
        'staffId',
        'staffName',
        'price',
        'finalPrice',
        'couponCode',
        'discountAmount',
        'depositAmount',
        'paidAmount',
        'paymentMethod',
        'status',
        'date',
        'time',
        'serviceLabel',
        'name'
      ],
      where: dateFilter,
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalRevenue = 0;
    let totalCount = 0;
    let futureRevenue = 0;

    const revenueByStaff = new Map();
    const futureByDate = new Map();

    appointments.forEach((a) => {
      const revenueBase = computeRevenue(a);
      const status = a.status || 'pending';
      const isCancelled = status === 'cancelled';
      const date = parseDate(a.date);

      if (!isCancelled) {
        totalRevenue += revenueBase;
        totalCount += 1;

        const staffKey = a.staffName || 'Ismeretlen';
        if (!revenueByStaff.has(staffKey)) {
          revenueByStaff.set(staffKey, { staffName: staffKey, count: 0, revenue: 0 });
        }
        const staffRow = revenueByStaff.get(staffKey);
        staffRow.count += 1;
        staffRow.revenue += revenueBase;

        if (date && date >= today) {
          futureRevenue += revenueBase;
          const dateKey = a.date;
          if (!futureByDate.has(dateKey)) {
            futureByDate.set(dateKey, { date: dateKey, count: 0, revenue: 0 });
          }
          const dateRow = futureByDate.get(dateKey);
          dateRow.count += 1;
          dateRow.revenue += revenueBase;
        }
      }
    });

    const appointmentRevenue = appointments.map((a) => {
      const status = a.status || 'pending';
      const isCancelled = status === 'cancelled';
      const price = normalizeAmount(a.finalPrice) ?? normalizeAmount(a.price) ?? 0;
      const paid = normalizeAmount(a.paidAmount);
      const deposit = normalizeAmount(a.depositAmount);
      const revenue = computeRevenue(a);
      return {
        id: a.id,
        date: a.date,
        time: a.time,
        serviceLabel: a.serviceLabel,
        staffName: a.staffName || 'Ismeretlen',
        clientName: a.name,
        status,
        price,
        couponCode: a.couponCode || null,
        discountAmount: Number.isFinite(normalizeAmount(a.discountAmount)) ? normalizeAmount(a.discountAmount) : null,
        depositAmount: Number.isFinite(deposit) ? deposit : null,
        paidAmount: Number.isFinite(paid) ? paid : null,
        paymentMethod: a.paymentMethod || null,
        revenue: isCancelled ? 0 : revenue
      };
    });

    const allDates = await Appointment.findAll({
      attributes: ['date'],
      order: [['date', 'ASC']]
    });
    const monthsSet = new Set();
    allDates.forEach((a) => {
      if (!a.date) return;
      monthsSet.add(String(a.date).slice(0, 7));
    });
    const availableMonths = Array.from(monthsSet.values()).sort();

    res.json({
      totalRevenue,
      totalCount,
      revenueByStaff: Array.from(revenueByStaff.values()).sort((a, b) => b.revenue - a.revenue),
      futureRevenue,
      futureByDate: Array.from(futureByDate.values()).sort((a, b) => a.date.localeCompare(b.date)),
      appointmentRevenue,
      availableMonths
    });
  } catch (error) {
    res.status(500).json({ error: 'Beveteli riport lekerese sikertelen' });
  }
};
