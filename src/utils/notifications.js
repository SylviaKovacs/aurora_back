
import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser || 'no-reply@example.com';
const adminNotifyEmail = process.env.ADMIN_NOTIFY_EMAIL;
const smsWebhookUrl = process.env.SMS_WEBHOOK_URL;

let transporter = null;
export const isEmailConfigured = () => Boolean(smtpHost && smtpUser && smtpPass);

const getTransporter = () => {
  if (!isEmailConfigured()) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
  return transporter;
};

const baseText = (a) => {
  return [
    `Név: ${a.name}`,
    `Szolgáltatás: ${a.serviceLabel}`,
    `Szakember: ${a.staffName || 'Nincs megadva'}`,
    `Dátum: ${a.date}`,
    `Idő: ${a.time}`,
    `Ár: ${a.price || 0} Ft`
  ].join('\n');
};

const templates = {
  created: (a) => ({
    subject: 'Időpontfoglalás visszaigazolás',
    text: `Sikeres időpontfoglalás.\n\n${baseText(a)}`,
    html: `<p>Sikeres időpontfoglalás.</p><pre>${baseText(a)}</pre>`
  }),
  updated: (a) => ({
    subject: 'Időpont módosítás',
    text: `Az időpontod módosult.\n\n${baseText(a)}`,
    html: `<p>Az időpontod módosult.</p><pre>${baseText(a)}</pre>`
  }),
  status: (a) => ({
    subject: 'Időpont státusz frissítés',
    text: `Az időpont státusza: ${a.status}\n\n${baseText(a)}`,
    html: `<p>Az időpont státusza: <strong>${a.status}</strong></p><pre>${baseText(a)}</pre>`
  }),
  cancelled: (a) => ({
    subject: 'Időpont lemondva',
    text: `Az időpontod lemondásra került.\n\n${baseText(a)}`,
    html: `<p>Az időpontod lemondásra került.</p><pre>${baseText(a)}</pre>`
  }),
  paymentStarted: (a, amount) => ({
    subject: 'Fizetés indult',
    text: `A fizetés elindult. Fizetendő összeg: ${amount} Ft.\n\n${baseText(a)}`,
    html: `<p>A fizetés elindult. Fizetendő összeg: <strong>${amount} Ft</strong>.</p><pre>${baseText(a)}</pre>`
  }),
  paymentSucceeded: (a, amount) => ({
    subject: 'Fizetés sikeres',
    text: `A fizetés sikeres. Összeg: ${amount} Ft.\n\n${baseText(a)}`,
    html: `<p>A fizetés sikeres. Összeg: <strong>${amount} Ft</strong>.</p><pre>${baseText(a)}</pre>`
  }),
  paymentFailed: (a, amount) => ({
    subject: 'Fizetés sikertelen',
    text: `A fizetés sikertelen. Összeg: ${amount} Ft.\n\n${baseText(a)}`,
    html: `<p>A fizetés sikertelen. Összeg: <strong>${amount} Ft</strong>.</p><pre>${baseText(a)}</pre>`
  }),
  couponRedeemed: (a, coupon) => ({
    subject: 'Kupon felhasználva',
    text: `Kupon felhasználva: ${coupon.code}. Kedvezmény: ${coupon.discount} Ft.\nVégösszeg: ${coupon.finalPrice} Ft.\n\n${baseText(a)}`,
    html: `<p>Kupon felhasználva: <strong>${coupon.code}</strong></p><p>Kedvezmény: <strong>${coupon.discount} Ft</strong><br>Végösszeg: <strong>${coupon.finalPrice} Ft</strong></p><pre>${baseText(a)}</pre>`
  }),
  reminder: (a) => ({
    subject: 'Időpont emlékeztető',
    text: `Holnap időpontod van.\n\n${baseText(a)}`,
    html: `<p>Holnap időpontod van.</p><pre>${baseText(a)}</pre>`
  })
};

// Export: sendEmail
export const sendEmail = async (to, subject, text, html) => {
  const mailer = getTransporter();
  if (!mailer) {
    return { ok: false, reason: 'smtp_not_configured' };
  }
  try {
    await mailer.sendMail({
      from: smtpFrom,
      to,
      subject,
      text,
      html
    });
    return { ok: true };
  } catch (error) {
    console.error('Email kuldes sikertelen:', error?.message || error);
    return { ok: false, reason: error?.message || 'smtp_send_failed' };
  }
};

const sendToUserAndAdmin = async (to, subject, text, html) => {
  if (to) {
    await sendEmail(to, subject, text, html);
  }
  if (adminNotifyEmail) {
    await sendEmail(adminNotifyEmail, `[ADMIN] ${subject}`, text, html);
  }
};

// Export: sendSms
export const sendSms = async (to, message) => {
  if (!smsWebhookUrl) return;
  try {
    await fetch(smsWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message })
    });
  } catch {
    // no-op
  }
};

// Export: notifyAppointmentCreated
export const notifyAppointmentCreated = async (appointment) => {
  const t = templates.created(appointment);
  await sendToUserAndAdmin(appointment.email, t.subject, t.text, t.html);
  if (appointment.phone) {
    await sendSms(appointment.phone, `${t.subject} - ${appointment.date} ${appointment.time}`);
  }
};

// Export: notifyAppointmentUpdated
export const notifyAppointmentUpdated = async (appointment) => {
  const t = templates.updated(appointment);
  await sendToUserAndAdmin(appointment.email, t.subject, t.text, t.html);
  if (appointment.phone) {
    await sendSms(appointment.phone, `${t.subject} - ${appointment.date} ${appointment.time}`);
  }
};

// Export: notifyAppointmentStatus
export const notifyAppointmentStatus = async (appointment) => {
  const t = templates.status(appointment);
  await sendToUserAndAdmin(appointment.email, t.subject, t.text, t.html);
  if (appointment.phone) {
    await sendSms(appointment.phone, `Statusz: ${appointment.status} - ${appointment.date} ${appointment.time}`);
  }
};

// Export: notifyAppointmentCancelled
export const notifyAppointmentCancelled = async (appointment) => {
  const t = templates.cancelled(appointment);
  await sendToUserAndAdmin(appointment.email, t.subject, t.text, t.html);
};

// Export: notifyPaymentStarted
export const notifyPaymentStarted = async (appointment, amount) => {
  const t = templates.paymentStarted(appointment, amount);
  await sendToUserAndAdmin(appointment.email, t.subject, t.text, t.html);
};

// Export: notifyPaymentSucceeded
export const notifyPaymentSucceeded = async (appointment, amount) => {
  const t = templates.paymentSucceeded(appointment, amount);
  await sendToUserAndAdmin(appointment.email, t.subject, t.text, t.html);
};

// Export: notifyPaymentFailed
export const notifyPaymentFailed = async (appointment, amount) => {
  const t = templates.paymentFailed(appointment, amount);
  await sendToUserAndAdmin(appointment.email, t.subject, t.text, t.html);
};

// Export: notifyCouponRedeemed
export const notifyCouponRedeemed = async (appointment, coupon) => {
  const t = templates.couponRedeemed(appointment, coupon);
  await sendToUserAndAdmin(appointment.email, t.subject, t.text, t.html);
};

// Export: notifyAppointmentReminder
export const notifyAppointmentReminder = async (appointment) => {
  const t = templates.reminder(appointment);
  await sendToUserAndAdmin(appointment.email, t.subject, t.text, t.html);
};
