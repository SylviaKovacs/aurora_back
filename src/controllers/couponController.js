import Coupon from '../models/Coupon.js';
import { Op } from 'sequelize';

const normalizeCode = (code) => (code || '').trim().toUpperCase();

const isCouponActive = (coupon) => {
  if (!coupon.active) return false;
  const today = new Date();
  const start = coupon.startDate ? new Date(coupon.startDate) : null;
  const end = coupon.endDate ? new Date(coupon.endDate) : null;
  if (start && today < start) return false;
  if (end && today > end) return false;
  if (coupon.usageLimit !== null && coupon.usageLimit !== undefined) {
    if (coupon.usageCount >= coupon.usageLimit) return false;
  }
  return true;
};

const calculateDiscount = (coupon, price) => {
  const base = Number(price) || 0;
  if (base <= 0) return { discount: 0, finalPrice: base };
  let discount = 0;
  if (coupon.type === 'percent') {
    discount = base * (Number(coupon.amount) || 0) / 100;
  } else {
    discount = Number(coupon.amount) || 0;
  }
  if (Number.isFinite(coupon.maxDiscount)) {
    discount = Math.min(discount, Number(coupon.maxDiscount));
  }
  if (Number.isFinite(coupon.minSpend)) {
    if (base < Number(coupon.minSpend)) discount = 0;
  }
  discount = Math.max(0, Math.min(discount, base));
  return { discount, finalPrice: base - discount };
};

export const listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Kuponok lekerese sikertelen' });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, type, amount, active, startDate, endDate, usageLimit, minSpend, maxDiscount } = req.body;

    const normalizedCode = normalizeCode(code);
    if (!normalizedCode) {
      return res.status(400).json({ error: 'Kupon kod kotelezo' });
    }
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Ervenytelen kedvezmeny' });
    }
    if (type && !['percent', 'fixed'].includes(type)) {
      return res.status(400).json({ error: 'Ismeretlen kupon tipus' });
    }

    const existing = await Coupon.findOne({ where: { code: normalizedCode } });
    if (existing) {
      return res.status(409).json({ error: 'Ez a kupon mar letezik' });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      type: type || 'percent',
      amount: numericAmount,
      active: active !== undefined ? !!active : true,
      startDate: startDate || null,
      endDate: endDate || null,
      usageLimit: usageLimit ?? null,
      minSpend: minSpend ?? null,
      maxDiscount: maxDiscount ?? null
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ error: 'Kupon letrehozasa sikertelen' });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Kupon nem talalhato' });

    const { code, type, amount, active, startDate, endDate, usageLimit, minSpend, maxDiscount } = req.body;
    if (code) coupon.code = normalizeCode(code);
    if (type) coupon.type = type;
    if (amount !== undefined) coupon.amount = Number(amount);
    if (active !== undefined) coupon.active = !!active;
    if (startDate !== undefined) coupon.startDate = startDate || null;
    if (endDate !== undefined) coupon.endDate = endDate || null;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit ?? null;
    if (minSpend !== undefined) coupon.minSpend = minSpend ?? null;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount ?? null;

    await coupon.save();
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ error: 'Kupon frissitese sikertelen' });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Kupon nem talalhato' });
    await coupon.destroy();
    res.json({ message: 'Kupon torolve' });
  } catch (error) {
    res.status(500).json({ error: 'Kupon torlese sikertelen' });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const code = normalizeCode(req.query.code || req.body?.code);
    const price = Number(req.query.price ?? req.body?.price ?? 0);
    if (!code) return res.status(400).json({ error: 'Kupon kod kotelezo' });

    const coupon = await Coupon.findOne({ where: { code } });
    if (!coupon) return res.status(404).json({ error: 'Kupon nem talalhato' });
    if (!isCouponActive(coupon)) return res.status(400).json({ error: 'Kupon nem aktiv' });

    const { discount, finalPrice } = calculateDiscount(coupon, price);
    if (discount <= 0) {
      return res.status(400).json({ error: 'Kupon nem alkalmazhato erre az osszegre' });
    }

    res.json({
      code: coupon.code,
      type: coupon.type,
      amount: coupon.amount,
      discount,
      finalPrice
    });
  } catch (error) {
    res.status(400).json({ error: 'Kupon ellenorzese sikertelen' });
  }
};

export const applyCouponToPrice = async (code, price) => {
  const normalized = normalizeCode(code);
  if (!normalized) return { coupon: null, discount: 0, finalPrice: price };
  const coupon = await Coupon.findOne({ where: { code: normalized } });
  if (!coupon || !isCouponActive(coupon)) {
    return { coupon: null, discount: 0, finalPrice: price };
  }
  const { discount, finalPrice } = calculateDiscount(coupon, price);
  return { coupon, discount, finalPrice };
};

export const incrementCouponUsage = async (couponId) => {
  if (!couponId) return;
  await Coupon.increment('usageCount', { where: { id: couponId } });
};
