import Appointment from '../models/Appointment.js';

const BARION_BASE = process.env.BARION_BASE_URL || 'https://api.test.barion.com';
const BARION_GATEWAY = process.env.BARION_GATEWAY_URL || 'https://test.barion.com/Pay';
const BARION_POS_KEY = process.env.BARION_POS_KEY || '';
const BARION_PAYEE = process.env.BARION_PAYEE || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const normalizeAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.round(amount) : 0;
};

const buildPaymentAmount = (appointment) => {
  const finalPrice = normalizeAmount(appointment.finalPrice ?? appointment.price);
  if (appointment.paymentMethod === 'online_deposit') {
    return normalizeAmount(appointment.depositAmount ?? 0);
  }
  return finalPrice;
};

const fetchBarionState = async (paymentId) => {
  const response = await fetch(`${BARION_BASE}/v2/Payment/GetPaymentState`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ POSKey: BARION_POS_KEY, PaymentId: paymentId })
  });
  const data = await response.json();
  return { ok: response.ok, data };
};

export const startBarionPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.status(400).json({ error: 'Idopont azonosito kotelezo' });
    }

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Idopont nem talalhato' });
    }

    if (!BARION_POS_KEY || !BARION_PAYEE) {
      return res.status(400).json({ error: 'Barion beallitas hianyzik' });
    }

    if (!['online_deposit', 'online_full'].includes(appointment.paymentMethod || '')) {
      return res.status(400).json({ error: 'Ehhez az idoponthoz nincs online fizetes' });
    }

    const amount = buildPaymentAmount(appointment);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Ervenytelen fizetendo osszeg' });
    }

    const paymentRequestId = `APPT-${appointment.id}-${Date.now()}`;
    const transactionId = `TX-${appointment.id}-${Date.now()}`;

    const payload = {
      POSKey: BARION_POS_KEY,
      PaymentType: 'Immediate',
      PaymentRequestId: paymentRequestId,
      GuestCheckout: true,
      FundingSources: ['All'],
      Locale: 'hu-HU',
      Currency: 'HUF',
      RedirectUrl: `${FRONTEND_URL}/main/payment-result?appointmentId=${appointment.id}`,
      CallbackUrl: `${BACKEND_URL}/api/payments/barion/callback`,
      Transactions: [
        {
          POSTransactionId: transactionId,
          Payee: BARION_PAYEE,
          Total: amount,
          Items: [
            {
              Name: appointment.serviceLabel || 'Aurora foglalas',
              Description: appointment.serviceLabel || 'Szolgaltatas',
              Quantity: 1,
              Unit: 'alkalom',
              UnitPrice: amount,
              ItemTotal: amount
            }
          ]
        }
      ]
    };

    const response = await fetch(`${BARION_BASE}/v2/Payment/Start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data?.PaymentId) {
      return res.status(400).json({ error: data?.Errors?.[0]?.Description || 'Barion inditas sikertelen' });
    }

    await appointment.update({
      paymentStatus: 'pending',
      barionPaymentId: data.PaymentId,
      barionPaymentRequestId: data.PaymentRequestId || paymentRequestId
    });

    const redirectUrl = `${BARION_GATEWAY}?Id=${data.PaymentId}`;
    res.json({ paymentId: data.PaymentId, redirectUrl });
  } catch (error) {
    res.status(500).json({ error: 'Barion fizetes inditasa sikertelen' });
  }
};

export const barionCallback = async (req, res) => {
  try {
    const paymentId = req.body?.PaymentId || req.body?.paymentId || req.query?.paymentId;
    if (!paymentId) {
      return res.status(400).json({ error: 'PaymentId hianyzik' });
    }

    const appointment = await Appointment.findOne({ where: { barionPaymentId: paymentId } });
    if (!appointment) {
      return res.status(404).json({ error: 'Idopont nem talalhato' });
    }

    const state = await fetchBarionState(paymentId);
    if (!state.ok) {
      return res.status(400).json({ error: 'Fizetesi statusz nem elerheto' });
    }

    const status = state.data?.Status || 'Unknown';
    let paymentStatus = 'pending';

    if (status === 'Succeeded') {
      paymentStatus = 'paid';
      const paidAmount = buildPaymentAmount(appointment);
      await appointment.update({
        paymentStatus,
        paidAmount
      });
    } else if (status === 'Failed') {
      paymentStatus = 'failed';
      await appointment.update({ paymentStatus });
    } else {
      await appointment.update({ paymentStatus: 'pending' });
    }

    res.json({ status: paymentStatus });
  } catch (error) {
    res.status(500).json({ error: 'Barion callback hiba' });
  }
};

export const barionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Idopont nem talalhato' });
    }

    if (!appointment.barionPaymentId) {
      return res.status(400).json({ error: 'Nincs Barion fizetes' });
    }

    const state = await fetchBarionState(appointment.barionPaymentId);
    if (!state.ok) {
      return res.status(400).json({ error: 'Fizetesi statusz nem elerheto' });
    }

    const status = state.data?.Status || 'Unknown';
    let paymentStatus = 'pending';

    if (status === 'Succeeded') {
      paymentStatus = 'paid';
      const paidAmount = buildPaymentAmount(appointment);
      await appointment.update({ paymentStatus, paidAmount });
    } else if (status === 'Failed') {
      paymentStatus = 'failed';
      await appointment.update({ paymentStatus });
    } else {
      await appointment.update({ paymentStatus: 'pending' });
    }

    res.json({ status: paymentStatus, barionStatus: status });
  } catch (error) {
    res.status(500).json({ error: 'Statusz lekeres sikertelen' });
  }
};
